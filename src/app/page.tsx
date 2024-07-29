import Image from "next/image";
import { SimpleSwap, TransactionProvider } from "@/components/simpleswap";

export default function Home() {
  return (
    <div>
      <TransactionProvider>
        <SimpleSwap />
      </TransactionProvider>
    </div>
  );
}
