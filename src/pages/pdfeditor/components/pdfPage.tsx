import React, { useEffect, useRef, useState } from 'react'

interface Props {
    page: Promise<any> | undefined, //current page
    scale: number,
    setDimensions: ({ width, height }: Dimensions) => void;
}

export function PdfPage({ page, scale,setDimensions }: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);


    useEffect(
        () => {

            const renderPage = async () => {
                const _page = await page;
                if (_page) {

                    const context = canvasRef.current?.getContext('2d');
                    const viewport = _page.getViewport({ scale: scale });
                    setWidth(viewport.width);
                    setHeight(viewport.height);
                    const newDimensions = {
                        width: viewport.width,
                        height: viewport.height,
                    };
                    setDimensions(newDimensions as Dimensions)

                    if (context) {
                        await _page.render({
                            canvasContext: canvasRef.current?.getContext('2d'),
                            viewport,
                        }).promise;
                    }

                }
            }

            renderPage()

        }
        , [page, scale]
    )

    return (
        <div className=' py-5'>
            <canvas className='border' ref={canvasRef} height={height} width={width}></canvas>
        </div>
    )
}
