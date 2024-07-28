import Image from "next/image";
import { SimpleSwap ,TransactionProvider} from "@/components/simpleswap";

export default function Home() {
  return (
    <div className = "flex justify-center items-center">
      <TransactionProvider>
      <SimpleSwap/>

      </TransactionProvider>
      
    </div>
    
  );
}
