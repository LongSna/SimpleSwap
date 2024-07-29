"use client"
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { entry } from '@/jupapi/main';
import React, { useReducer, createContext, useContext, ReactNode } from 'react';
import Draggable from 'react-draggable';

interface SwapButtonProps {
  onSwap: () => void;
}
//state.transactionProcessStatus

interface State {
  transactionProcessStatus: string;
  transactionProcessDetails: string;
}

type Action =
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_DETAILS'; payload: string };

const initialState: State = {
  transactionProcessStatus: 'Free',
  transactionProcessDetails: 'Detail information is None',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, transactionProcessStatus: action.payload };
    case 'SET_DETAILS':
      return { ...state, transactionProcessDetails: action.payload };
    default:
      return state;
  }
}

interface TransactionContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function UseTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}



export default function SwapButton({ onSwap }: SwapButtonProps) {
  const { state, dispatch } = UseTransaction();
  const [swapButton, setSwapButton] = useState("Swap");
  return (
    <Button onClick={onSwap} type="button" className="w-full">
      {state.transactionProcessStatus == "Free" ? "Swap" : "Processing"}
    </Button>
  );
}



export function SimpleSwap() {
  const [RPC, setRPC] = useState('')
  const { state, dispatch } = UseTransaction();
  const [privateKey, setPrivateKey] = useState('');
  const [inputMint, setInputMint] = useState('');
  const [outputMint, setOutputMint] = useState('');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('');
  const [prioritizationFee, setPrioritizationFee] = useState('{"priorityLevelWithMaxLamports": {"priorityLevel": "veryHigh", "maxLamports": 5000000}}')
  const [quotePollingDelay, setQuotePollingDelay] = useState('')
  const [directRoutes, setDirectRoutes] = useState(false);

  const handleSwap = async () => {
    try {

      //alert(`Private Key :${privateKey} Input Mint: ${inputMint}, Output Mint: ${outputMint}, Amount: ${amount}, Slippage: ${slippage}, Direct Routes: ${directRoutes}`);
      await entry(privateKey, inputMint, outputMint, amount as unknown as number, slippage as unknown as number, directRoutes, dispatch, prioritizationFee, ~~quotePollingDelay, RPC)
    } catch (e) {
      dispatch({ type: "SET_DETAILS", payload: "TopError: " + e as unknown as string })
    }
    dispatch({ type: "SET_STATUS", payload: "Free" })
    dispatch({ type: "SET_DETAILS", payload: "Detail information is None" })

  };

  return (
    <>
      <Card className="w-full mx-auto max-w-5xl mt-4">
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
          <CardDescription>Enter your swap details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="RPC URL">RPC URL</Label>
              <Input id="RPC" placeholder="Enter RPC URL" value={RPC} onChange={(e) => setRPC(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="privateKey">Private Key(BASE58)</Label>
              <Input id="privateKey" placeholder="Enter private key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inputMint">Input Mint</Label>
              <Input id="inputMint" placeholder="Enter input mint" value={inputMint} onChange={(e) => setInputMint(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outputMint">Output Mint</Label>
              <Input id="outputMint" placeholder="Enter output mint" value={outputMint} onChange={(e) => setOutputMint(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Input Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prioritizationFee">PrioritizationFee</Label>
              <a href="https://station.jup.ag/api-v6/post-swap" target="_blank" rel="noopener noreferrer">
                *Advanced Option document
              </a>
              <Input id="prioritizationFee" placeholder="Enter PrioritizationFee " value={prioritizationFee} onChange={(e) => setPrioritizationFee(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slippage">Slippage BPS</Label>
              <Input id="slippage" type="number" placeholder="Enter slippage" value={slippage} onChange={(e) => setSlippage(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quotePollingDelay">Quote Polling Delay(ms)</Label>
              <Input id="slippage" type="number" placeholder="Enter Quote Polling Delay" value={quotePollingDelay} onChange={(e) => setQuotePollingDelay(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="directRoutes"
                checked={directRoutes}
                onClick={() => {

                  setDirectRoutes(!directRoutes);
                }}
              />
              <Label htmlFor="directRoutes">Only Direct Routes</Label>
            </div>

            <SwapButton onSwap={handleSwap} />
          </form>
        </CardContent>
      </Card>
      <Draggable>
        <Card className="w-full max-w-md mx-auto mt-5">
          <CardHeader>
            <CardTitle>Draggable Swap Status</CardTitle>
            <CardDescription>{state.transactionProcessStatus}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full break-words">

              {state.transactionProcessDetails}
            </div>

          </CardContent>
        </Card>
      </Draggable>

      <div className="text-center text-gray-300 text-sm w-full mt-3 border-t">
        <a href="https://github.com/LongSna/SimpleSwap" target="_blank" rel="noopener noreferrer" className='underline'>Github</a>｜<a href="https://github.com/LongSna/SimpleSwap/blob/main/donate.md" target="_blank" rel="noopener noreferrer" className='underline'>Donate</a>
      </div>
    </>
  );
}
