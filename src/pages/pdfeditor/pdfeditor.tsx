import React, { useEffect, useState } from 'react'
import { assetObjects, getAsset } from '../../utils/prepareAssets';
import { PdfPage } from './components/pdfPage';


export interface Pdf {
    name: string;
    file: File;
    pages: Promise<any>[];
}

export default function PdfEditor() {

    const [name, setName] = useState('');
    const [pageIndex, setPageIndex] = useState(-1);
    const [file, setFile] = useState<File>();
    const [pages, setPages] = useState<any[]>([]);
    const [isMultiPage, setIsMultiPage] = useState(false);
    const [isFirstPage, setIsFirstPage] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const [scale,setScale] = useState(1)


    async function onPdfChange(event: React.ChangeEvent<HTMLInputElement> & { dataTransfer?: DataTransfer }) {

        const file = event.target?.files?.[0]
        if (file) {
            const pdfJsLib = await getAsset('pdfjsLib')
            // Safari possibly get webkitblobresource error 1 when using origin file blob
            const blob = new Blob([file]);
            const url = window.URL.createObjectURL(blob);
            //reading as pdf
            const pdf = await pdfJsLib.getDocument(url).promise;
            //this is pdf details
            const result = {
                file,
                name: file.name,
                pages: Array(pdf.numPages)
                    .fill(0)
                    .map((_, index) => pdf.getPage(index + 1)),
            } as Pdf;

            const multi = result.pages.length > 1;
            setName(result.name);
            setFile(result.file);
            setPages(result.pages);
            setPageIndex(0);
            setIsMultiPage(multi);
            setIsFirstPage(true);
            setIsLastPage(result.pages.length === 1);
            setFile(file)

        }

    }

    return (
        <div className=' max-h-screen min-h-screen h-screen flex flex-col overflow-hidden w-full'>
            <div className='py-2 h-min w-full border-b border-gray-400 flex justify-center'>
                <input type="file" onChange={onPdfChange} accept='application/pdf' />
            </div>
            <div className=' grow overflow-auto flex justify-center'>
                {
                    pages?.length && pages.length > 0 ?
                        <>
                            <PdfPage
                                page={pages[pageIndex]}
                                scale={scale}
                            />

                        </>
                        : null
                }
            </div>
            <div className=' py-2 h-min w-full border-t border-gray-400 flex  gap-2 justify-center'>
                {/* INDEX */}
                {
                    (pages?.length && pages.length) ?
                        <div className=' flex border rounded-md w-min'>
                            <div className='p-2' onClick={
                                () => {
                                    if (pageIndex > 0) {
                                        setPageIndex(pageIndex - 1)
                                    }
                                }
                            } >{'<'}</div>
                            <div className=' border-x p-2 whitespace-nowrap'>{pageIndex + 1} of {pages.length}</div>
                            <div className=' p-2' onClick={
                                () => {
                                    if (pages.length > pageIndex + 1) {
                                        setPageIndex(pageIndex + 1)
                                    }
                                }
                            } >{'>'}</div>
                        </div>
                        : null
                }
                {/* doogles */}
                {

                    <div className='w-min border rounded-md flex'>
                        <div className=' p-2 border-r' onClick={()=>setScale(scale-1)}>-</div>
                        <div className=' p-2' onClick={()=>setScale(scale+1)} >+</div>
                    </div>

                }
            </div>
        </div>
    );
}
