import { IconArrowUpLeftCircle } from '@tabler/icons-react'
import { KonvaEventObject } from 'konva/lib/Node'
import { Stage as StageType } from 'konva/lib/Stage'
import React, { useRef, useState, SetStateAction } from 'react'
import { Arrow as KonvaArrow, Image as KonvaImage, Layer, Stage } from 'react-konva'

interface stagePptType {
    height: number,
    width: number
}

enum DrawAction {
    Select = 'select',
    Arrow = 'arrow',
}

type Shape = {
    id?: string | undefined;
    color?: string;
    x?: number | undefined;
    y?: number | undefined;
};

type Arrow = Shape & {
    points: [number, number, number, number];
};

export default function EditorPage() {

    const [stagePpt, setStagePpt] = useState<stagePptType>({
        height: 600,
        width: 600
    })
    const stageRef = useRef<StageType>(null)
    const [drawMode, setDrawMode] = useState<DrawAction>()
    const [arrow, setArrow] = useState<Arrow>()
    const isPaintRef = useRef(false)
    const [image, setImage] = useState<HTMLImageElement>()

    const onStageMouseDown = (event: KonvaEventObject<MouseEvent>) => {
        if (drawMode === DrawAction.Select) return

        isPaintRef.current = true
        const stage = stageRef.current
        const pos = stage?.getPointerPosition()
        const x = pos?.x || 0
        const y = pos?.y || 0
        const id = '1'
        const color = 'black'

        switch (drawMode) {

            case DrawAction.Arrow: {
                setArrow({
                    id,
                    points: [x, y, x, y],
                    color,

                });
                break;
            }

        }

    }

    const onStageMouseMove = (evt: KonvaEventObject<MouseEvent>) => {

        if (drawMode === DrawAction.Select || !isPaintRef.current) return;

        const stage = stageRef?.current;
        // const id = currentShapeRef.current;
        const pos = stage?.getPointerPosition();
        const x = pos?.x || 0;
        const y = pos?.y || 0;

        switch (drawMode) {
            case DrawAction.Arrow:

                setArrow(
                    {
                        ...arrow,
                        points: [arrow?.points[0] || 0, arrow?.points[1] || 0, x, y]
                    }
                )

                break;

            default:
                break;
        }

    }

    const onStageMouseUp = (evt: KonvaEventObject<MouseEvent>)=>{

        isPaintRef.current = false

    }

    const imageOnchangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files?.[0]) {
            const imgUrl = URL.createObjectURL(event.target.files[0])
            const image = new Image()
            // const image = new Image(stagePpt.width/2,stagePpt.height/2)
            image.onload = () => {
                const height = image.naturalHeight; // Use naturalHeight for accurate size
                setStagePpt(
                    {
                        ...stagePpt,
                        height: image.naturalHeight,
                        width: image.naturalWidth
                    }
                )
                console.log(height)
            };
            image.src = imgUrl

            setImage(image)
        }

    }

    const imageDowloadHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        const dataUri = stageRef.current?.toDataURL(
            { pixelRatio: 1 }
        )
        // Check if dataUri is available (handle potential errors)
        if (!dataUri) {
            console.error("Error: Unable to capture canvas data");
            return;
        }

        // Create a link element to simulate download
        const link = document.createElement("a");
        link.href = dataUri;
        link.download = "image.png"; // Set desired filename

        // Click the link to trigger download (simulated click)
        link.click();

    }

    return (
        <div className=' flex flex-col w-min'>
            <div className=' flex items-end gap-2'>
                <button onClick={() => setDrawMode(DrawAction.Arrow)} className='p-1 border border-black'><IconArrowUpLeftCircle /></button>
                <input type="file" accept='image/png,image/jpeg' onChange={imageOnchangeHandler} />
                <button className=' border border-gray-500 px-2 py-1 ' onClick={imageDowloadHandler} >Download image</button>
            </div>
            <div className='border border-black'>
                <div className='  w-[600px] h-[600px] overflow-auto'>
                    {/* stage is like canvas */}
                    <Stage
                        height={stagePpt.height}
                        width={stagePpt.width}
                        ref={stageRef}
                        onMouseDown={onStageMouseDown}
                        onMouseMove={onStageMouseMove}
                        onMouseUp={onStageMouseUp}
                    >

                        <Layer>
                            {
                                image &&
                                <KonvaImage
                                    image={image}
                                    width={stagePpt.width}
                                    height={stagePpt.height}
                                />
                            }
                            {
                                arrow &&
                                <KonvaArrow
                                    key={arrow.id}
                                    id={arrow.id}
                                    points={arrow.points}
                                    fill={arrow.color}
                                    stroke={arrow.color}
                                    strokeWidth={4}
                                />
                            }
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    )
}
