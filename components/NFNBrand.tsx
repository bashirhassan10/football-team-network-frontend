import Image from "next/image";
type Props={compact?:boolean};
export default function NFNBrand({compact=false}:Props){
 return <span className="nfnBrandIdentity">
   <Image src="/nfn-mark.svg" alt="Naija Football Network emblem" width={44} height={44} className="nfnBrandEmblem" priority/>
   {!compact&&<span className="nfnBrandText"><strong>Naija Football</strong><b>Network</b></span>}
 </span>;
}
