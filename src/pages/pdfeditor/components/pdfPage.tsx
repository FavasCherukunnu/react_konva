import React, { useEffect, useRef, useState } from 'react'

interface Props {
    page: Promise<any> | undefined, //current page
    scale:number
}

export function PdfPage({ page ,scale}: Props) {

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
        , [page,scale]
    )

    return (
        <div>
            <canvas ref={canvasRef} height={height} width={width}></canvas>
        </div>
    )
}
