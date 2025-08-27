'use client';
 
import './search.css';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Image from "next/image";


export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) =>{
        console.log(term);
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    
    return (
        <div className="search_container">
            <label htmlFor="search" >
                <Image src="/search-line.svg" alt="Search" width={20} height={20} />
            </label>
            <input 
                type="text"
                placeholder={placeholder}
                onChange={(e) => {
                handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    );
}   