import {
  BlockhashWithExpiryBlockHeight,
  Connection,
  TransactionExpiredBlockheightExceededError,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import promiseRetry from "promise-retry";
import { wait } from "./wait";
import { Dispatch } from "react";

type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection;
  serializedTransaction: Buffer;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
};

const SEND_OPTIONS = {
  skipPreflight: true,
};

// confirm function has been removed
export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs,gdispatch: Dispatch<{ type: "SET_STATUS"; payload: string; } | { type: "SET_DETAILS"; payload: string; }>): Promise<VersionedTransactionResponse | null> {
  const txid = await connection.sendRawTransaction(
    serializedTransaction,
    SEND_OPTIONS
  );
  try{
    await connection.sendRawTransaction(
      serializedTransaction,
      SEND_OPTIONS
    );

  }catch(e){
    console.warn(e)

  }
  gdispatch({type:"SET_STATUS",payload:"Checking..."})
  gdispatch({type:"SET_DETAILS",payload:"Checking Transaction..."})


  const controller = new AbortController();
  const abortSignal = controller.signal;

  const abortableResender = async () => {
    while (true) {
      if (abortSignal.aborted){
        
        return
      } ;
      try {
        await connection.sendRawTransaction(
          serializedTransaction,
          SEND_OPTIONS
          
        );
        
      } catch (e) {
        gdispatch({type:"SET_DETAILS",payload:`Failed to resend transaction: ${e}`})
        gdispatch({type:"SET_STATUS",payload:`Failed`})
        return
        
      }
    }
  };
  


  try {
    abortableResender();
    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

    // this would throw TransactionExpiredBlockheightExceededError
    await Promise.race([
      connection.confirmTransaction(
        {
          ...blockhashWithExpiryBlockHeight,
          lastValidBlockHeight,
          signature: txid,
          abortSignal,
        },
        "confirmed"
      ),
      
      new Promise(async (resolve) => {
        // in case ws socket died
        while (!abortSignal.aborted) {
          gdispatch({type:"SET_DETAILS",payload:`Check details:lastValidBlockHeight-${lastValidBlockHeight} `})
          await wait(20);
          const tx = await connection.getSignatureStatus(txid, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === "confirmed") {
            resolve(tx);
          }
        }
      }),
    ]);
  } catch (e) {
    gdispatch({type:"SET_DETAILS",payload:`Check details: ${e}`})
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      // we consume this error and getTransaction would return null
     
      return null;
    } else {
      // invalid state from web3.js
      throw e;
    }
  } finally {
    controller.abort();
  }

  // in case rpc is not synced yet, we add some retries
  const response = promiseRetry(
    async (retry) => {
      const response = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!response) {
        retry(response);
      }
      return response;
    },
    {
      retries: 10,
      minTimeout: 1e3,
    }
  );

  return response;
  
  

}
