import { MyWallet as Wallet } from "./myWallet";
import {
  QuoteGetRequest,
  QuoteResponse,
  createJupiterApiClient
} from "@jup-ag/api";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import React from "react";
import { getSignature } from "./getSignature";
import { transactionSenderAndConfirmationWaiter } from "./transactionSender";

import { wait } from "./wait";

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  daily_volume: number;
  freeze_authority: string | null;
  mint_authority: string;
}

async function getTokenDecimals(token: string) {
  const url = "https://tokens.jup.ag/token/" + token;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      gdispatch({
        type: "SET_DETAILS",
        payload: ("Error fetching token data:" +
          response.ok) as unknown as string,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.decimals;
  } catch (error) {
    gdispatch({
      type: "SET_DETAILS",
      payload: ("Error fetching token data:" + error) as unknown as string,
    });
    throw new Error(`Error fetching token data: ${error}`);
  }
}

var privateKey: string;
var inputMint: string;
var outputMint: string;
var amount: number;
var slippage: number;
var onlyDirectRoutes: boolean;
var gQuote: QuoteResponse;
var gRPC_URL: string = "";
var gPrioritizationFee: string;
var connection: Connection;

var gdispatch: React.Dispatch<
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_DETAILS"; payload: string }
>;

export async function entry(
  eprivateKey: string,
  einputMint: string,
  eoutputMint: string,
  eamount: number,
  eslippage: number,
  eonlyDirectRoutes: boolean,
  dispatch: React.Dispatch<
    | { type: "SET_STATUS"; payload: string }
    | { type: "SET_DETAILS"; payload: string }
  >,
  prioritizationFee: string,
  quotePollingDelay: number,
  RPC: string
) {
  gdispatch = dispatch;
  gdispatch({ type: "SET_STATUS", payload: "Processing" });
  console.error("touch entry point");

  var decimals: number = 0;

  gRPC_URL = RPC;
  try {
    gPrioritizationFee = JSON.parse(prioritizationFee);
  } catch (e) {
    throw e;
  }
  privateKey = eprivateKey;
  inputMint = einputMint;
  outputMint = eoutputMint;

  slippage = eslippage;
  onlyDirectRoutes = eonlyDirectRoutes;
  privateKey = eprivateKey;
  connection = new Connection(gRPC_URL);

  while (true) {
    try {
      decimals = ~~(await getTokenDecimals(inputMint)) as number;
      if (decimals != 0) break;
      await wait(1_000);
    } catch (e) {
      gdispatch({
        type: "SET_DETAILS",
        payload: ("getDecimalsError: " + e) as unknown as string,
      });
      if (e instanceof TypeError) {
        break;
      }
    }
  }
  amount = eamount * 10 ** decimals;

  console.error("ddd: ", decimals, " ", eamount, " ", amount);
  console.error("touch entry point defed");

  while (true) {
    console.error("Quoted");
    gdispatch({ type: "SET_STATUS", payload: "Getting quote..." });
    var quote: QuoteResponse;
    try {
      quote = await getQuote();
      if (!quote) {
        await new Promise((f) => setTimeout(f, quotePollingDelay)); // delay
        continue;
      } else {
        gQuote = quote;
        break;
      }
    } catch (e: any) {
      gdispatch({
        type: "SET_DETAILS",
        payload: ("Quoting Error: " + e) as unknown as string,
      });
      console.warn(e);
    }
  }
  console.error("touch flow");
  try {
    await flowQuoteAndSwap();
  } catch (e) {
    gdispatch({
      type: "SET_DETAILS",
      payload: ("FAQSError: " + e) as unknown as string,
    });
  }
}
// Make sure that you are using your own RPC endpoint.

const jupiterQuoteApi = createJupiterApiClient();

async function getQuote() {
  // basic params
  const params: QuoteGetRequest = {
    inputMint: inputMint,
    outputMint: outputMint,
    amount: amount,
    slippageBps: slippage,
    onlyDirectRoutes: onlyDirectRoutes,
    asLegacyTransaction: false,
  };

  // auto slippage w/ minimizeSlippage params
  //const params: QuoteGetRequest = {
  //inputMint: "So11111111111111111111111111111111111111112",
  //outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // $WIF
  //amount: 1, // 0.1 SOL
  //slippageBps: 10,
  //autoSlippage: true,
  //autoSlippageCollisionUsdValue: 1_000,
  //maxAutoSlippageBps: 1000, // 10%
  //minimizeSlippage: true,
  //onlyDirectRoutes: onlyDirectRoutes,
  //asLegacyTransaction: false,
  //};

  // get quote
  try {
    const quote = await jupiterQuoteApi.quoteGet(params);

    if (!quote) {
      return "" as unknown as QuoteResponse;
    }

    return quote;
  } catch (e: any) {
    gdispatch({
      type: "SET_DETAILS",
      payload: ("tryQuoteFail: " + e) as unknown as string,
    });

    return 0 as unknown as QuoteResponse;
  }
}

async function getSwapObj(wallet: Wallet, quote: QuoteResponse) {
  // Get serialized transaction
  const swapObj = await jupiterQuoteApi.swapPost({
    swapRequest: {
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: gPrioritizationFee,
    },
  });
  return swapObj;
}

async function flowQuote() {
  const quote = await getQuote();
  console.dir(quote, { depth: null });
}

async function flowQuoteAndSwap() {
  console.error("flowQuote");
  const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(privateKey)));
  console.error("Wallet:", wallet.publicKey.toBase58());
  gdispatch({
    type: "SET_STATUS",
    payload: "Processing...\nWallet: " + wallet.publicKey.toBase58(),
  });

  const quote = gQuote;
  console.dir(quote, { depth: null });
  const swapObj = await getSwapObj(wallet, quote);
  console.dir(swapObj, { depth: null });
  gdispatch({ type: "SET_DETAILS", payload: "Getting swapObj..." });

  // Serialize the transaction
  const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");
  var transaction = VersionedTransaction.deserialize(
    swapTransactionBuf as unknown as Uint8Array
  );
  //transaction.message.recentBlockhash = await (await connection.getLatestBlockhash()).blockhash

  // Sign the transaction
  transaction.sign([wallet.payer]);
  const signature = getSignature(transaction);

  // We first simulate whether the transaction would be successful
  /*
    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
        commitment: "processed",
      });
    const { err, logs } = simulatedTransactionResponse;

    if (err) {
      // Simulation error, we can check the logs for more details
      // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
      console.error("Simulation Error:");
      console.warn({ err, logs });
      return;
    }
      */

  const serializedTransaction = Buffer.from(transaction.serialize());
  const blockhash = transaction.message.recentBlockhash;
  //alert(`Transaction:https://solscan.io/tx/${signature}`);

  gdispatch({ type: "SET_DETAILS", payload: "Sending Transaction..." });
  const txid = await connection.sendRawTransaction(serializedTransaction, {
    skipPreflight: true,
    maxRetries: 2,
  });
  try {
    const transactionResponse = await transactionSenderAndConfirmationWaiter(
      {
        connection,
        serializedTransaction,
        blockhashWithExpiryBlockHeight: {
          blockhash,
          lastValidBlockHeight: swapObj.lastValidBlockHeight,
        },
      },
      gdispatch
    );

    // If we are not getting a response back, the transaction has not confirmed.
    if (!transactionResponse) {
      //console.error("Transaction not confirmed");
      return;
    }

    if (transactionResponse.meta?.err) {
      gdispatch({
        type: "SET_DETAILS",
        payload: "Transaction Error: https://solscan.io/tx/" + signature,
      });
      return;
    }
    gdispatch({
      type: "SET_DETAILS",
      payload: "Transaction Confirmed: \nhttps://solscan.io/tx/" + signature,
    });
  } catch (e) {
    gdispatch({
      type: "SET_DETAILS",
      payload: ("sendT2Error: " + e) as string,
    });
  }
}

/*
  export async function main() {
    switch (process.env.FLOW) {
      case "quote": {
        await flowQuote();
        break;
      }

      case "quoteAndSwap": {
        await flowQuoteAndSwap();
        break;
      }

      default: {
        console.error("Please set the FLOW environment");
      }
    }
  }
    */

//main();
