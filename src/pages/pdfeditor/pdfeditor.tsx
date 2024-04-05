import React, { useEffect, useState } from 'react'
import { assetObjects, getAsset } from './utils/prepareAssets';
import { PdfPage } from './components/pdfPage';
import { readAsArrayBuffer } from './utils/asyncReader';
import { ggID } from './utils/helpers';
import { Attachments } from './components/Attachments';


export interface Pdf {
    name: string;
    file: File;
    pages: Promise<any>[];
}

type AttachmentType = 'image' | 'text' | 'drawing';
export enum AttachmentTypes {
    IMAGE = 'image',
    DRAWING = 'drawing',
    TEXT = 'text',
}

interface AttachmentBase {
    id: () => number;
    width: number;
    height: number;
    x: number;
    y: number;
    type: AttachmentType;
}

export interface TextAttachment extends AttachmentBase {
    text?: string;
    fontFamily?: string;
    size?: number;
    lineHeight?: number;
    lines?: string[];
}
interface ImageAttachment extends AttachmentBase {
    file: File;
    img: HTMLImageElement;
}

interface DrawingAttachment extends AttachmentBase {
    path?: string;
    scale?: number;
    stroke?: string;
    strokeWidth?: number;
}

type Attachment = ImageAttachment | DrawingAttachment | TextAttachment;


type Attachments = Attachment[];


export default function PdfEditor() {

    const [name, setName] = useState('');
    const [pageIndex, setPageIndex] = useState(-1);
    const [file, setFile] = useState<File>();
    const [pages, setPages] = useState<any[]>([]);
    const [isMultiPage, setIsMultiPage] = useState(false);
    const [isFirstPage, setIsFirstPage] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const [scale, setScale] = useState(2)
    const [allPageAttachments, setAllPageAttachments] = useState<Attachments[]>([])
    const [dimensions, setDimensions] = useState<Dimensions>();

    const downloadPdf = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        if (!file) return;
        const PDFLib = await getAsset('PDFLib');
        const download = await getAsset('download');
        let pdfDoc: {
            getPages: () => any[];
            embedFont: (arg0: unknown) => any;
            embedJpg: (arg0: unknown) => any;
            embedPng: (arg0: unknown) => any;
            embedPdf: (arg0: any) => [any] | PromiseLike<[any]>;
            save: () => any;
        };

        try {
            pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(file));

        } catch (e) {
            console.log('Failed to load PDF.');
            throw e;
        }

        try {
            const pdfBytes = await pdfDoc.save();
            download(pdfBytes, name, 'application/pdf');
        } catch (e) {
            console.log('Failed to save PDF.');
            throw e;
        }

    }

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

    const addAttachment = (attachment: Attachment) => {
        if (pageIndex < 0) return;
        const newAllPageAttachmentsAdd = allPageAttachments.map(
            (attachments, index) =>
                pageIndex === index
                    ? [...attachments, attachment]
                    : attachments
        );
        setAllPageAttachments(newAllPageAttachmentsAdd)
    }
    const removeAttachment = (attachmentIndex: number) => {
        const newAllPageAttachmentsRemove = allPageAttachments.map(
            (otherPageAttachments, index) =>
                pageIndex === index
                    ? allPageAttachments[pageIndex].filter(
                        (_, _attachmentIndex) =>
                            _attachmentIndex !== attachmentIndex
                    )
                    : otherPageAttachments
        );
        setAllPageAttachments(newAllPageAttachmentsRemove)
    }
    const updateAttachment = (attachmentIndex: number,attachment: Partial<Attachment>) => {
        if (pageIndex === -1) {
            return ;
        }

        const newAllPageAttachmentsUpdate = allPageAttachments.map(
            (otherPageAttachments, index) =>
                pageIndex === index
                    ? allPageAttachments[pageIndex].map((oldAttachment, _attachmentIndex) =>
                        _attachmentIndex === attachmentIndex
                            ? { ...oldAttachment, ...attachment }
                            : oldAttachment
                    )
                    : otherPageAttachments
        );
    }

    const addText = () => {
        const newTextAttachment: TextAttachment = {
            id: ggID(),
            type: AttachmentTypes.TEXT,
            x: 0,
            y: 0,
            width: 120,
            height: 25,
            size: 16,
            lineHeight: 1.4,
            fontFamily: 'Times-Roman',
            text: 'Enter Text Here',
        };
        addAttachment(newTextAttachment);
    };

    return (
        <div className=' max-h-screen min-h-screen h-screen flex flex-col overflow-hidden w-full'>
            <div className='py-2 h-min w-full border-b border-gray-400 flex justify-center gap-1'>
                <input type="file" onChange={onPdfChange} accept='application/pdf' />
                <button onClick={downloadPdf} className=' px-2 py-1 border border-gray-400 hover:bg-gray-200'>Download</button>
                <button className='px-2 py-1 border border-gray-400 hover:bg-gray-200 font-bold'>Aa</button>
            </div>
            <div className=' grow overflow-auto flex justify-center'>
                <div className=' relative w-min h-min'>
                    {
                        pages?.length && pages.length > 0 ?
                            <>
                                <PdfPage
                                    page={pages[pageIndex]}
                                    scale={scale}
                                    setDimensions={setDimensions}
                                />

                            </>
                            : null
                    }
                    {dimensions && (
                        <Attachments
                            pdfName={name}
                            removeAttachment={removeAttachment}
                            updateAttachment={updateAttachment}
                            pageDimensions={dimensions}
                            attachments={allPageAttachments[pageIndex]}
                        />
                    )}
                </div>
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

                    // <div className='w-min border rounded-md flex'>
                    //     <div className=' p-2 border-r' onClick={() => setScale(scale - 0.2)}>-</div>
                    //     <div className=' p-2' onClick={() => setScale(scale + 0.2)} >+</div>
                    // </div>

                }
            </div>
        </div>
    );
}
