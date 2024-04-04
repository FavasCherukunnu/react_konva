import { IconArrowUpLeftCircle, IconCircle, IconClick } from '@tabler/icons-react'
import { KonvaEventObject } from 'konva/lib/Node'
import { Stage as StageType } from 'konva/lib/Stage'
import { Transformer } from 'konva/lib/shapes/Transformer'
import React, { useRef, useState, SetStateAction, useEffect } from 'react'
import { Arrow as KonvaArrow, Image as KonvaImage, Layer, Stage, Rect as KonvaRect, Transformer as KonvaTransformer, Circle as KonvaCircle } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'

interface stagePptType {
    height: number,
    width: number
}


enum DrawAction {
    Select = 'select',
    Arrow = 'arrow',
    Circle = 'circle'
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

type Circle = Shape & {
    radius: number;
    x: number;
    y: number;
};

type ActionButton = {
    icon: React.ReactElement,
    value: DrawAction,
    onClick: () => void
}

enum objectType {
    Arrow = 'arrow',
    Circle = 'circle'
}

type editorObject = {
    id: string,
    type: objectType,
    arrow?: Arrow,
    circle?: Circle
}

export default function EditorPage() {

    const [stagePpt, setStagePpt] = useState<stagePptType>({
        height: 600,
        width: 966
    })
    const stageRef = useRef<StageType>(null)
    const [drawMode, setDrawMode] = useState<DrawAction>()
    // const [arrow, setArrow] = useState<Arrow>()
    // const [circle, setCircle] = useState<Circle>();
    const [image, setImage] = useState<HTMLImageElement>()

    const [objects, setObjects] = useState<editorObject[]>([])


    const isPaintRef = useRef(false)
    const selectedIdRef = useRef('')
    const canvasOuterRef = useRef<HTMLDivElement>(null)
    const transformerRef = useRef<Transformer>(null)

    const onStageMouseDown = (event: KonvaEventObject<MouseEvent>) => {
        if (drawMode === DrawAction.Select) return

        isPaintRef.current = true
        const stage = stageRef.current
        const pos = stage?.getPointerPosition()
        const x = pos?.x || 0
        const y = pos?.y || 0
        const color = 'black'
        const uniqueId = uuidv4();
        selectedIdRef.current = uniqueId

        switch (drawMode) {

            case DrawAction.Arrow: {


                const singleobject: editorObject = {
                    id: uniqueId,
                    type: objectType.Arrow,
                    arrow: {
                        id: uniqueId,
                        points: [x, y, x, y],
                        color,

                    }
                }

                objects.push(singleobject)
                setObjects([...objects])

                // setArrow({
                //     id,
                //     points: [x, y, x, y],
                //     color,

                // });
                break;
            }

            case DrawAction.Circle: {


                const singleobject: editorObject = {
                    id: uniqueId,
                    type: objectType.Circle,
                    circle: {
                        // ...circle,
                        id: uniqueId,
                        radius: 1,
                        x,
                        y,
                        color,
                    }
                }

                objects.push(singleobject)
                setObjects([...objects])
                // setCircle(
                //     {
                //         ...circle,
                //         id: '2',
                //         radius: 1,
                //         x,
                //         y,
                //         color,
                //     })

                break;
            }
        }

    }

    const onStageMouseMove = (evt: KonvaEventObject<MouseEvent>) => {

        if (drawMode === DrawAction.Select || !isPaintRef.current) return;

        const stage = stageRef?.current;
        // const id = currentShapeRef.current;
        const pos = stage?.getPointerPosition();
        const x = pos?.x! || 0;
        const y = pos?.y! || 0;

        const index = objects.findIndex(
            item => selectedIdRef.current == item.id
        )
        if (index < 0) {
            return;
        }

        switch (drawMode) {
            case DrawAction.Arrow:

                objects[index].arrow = {
                    ...objects[index].arrow,
                    points: [objects[index].arrow?.points[0] || 0, objects[index].arrow?.points[1] || 0, x, y]
                }

                setObjects([...objects])

                // setArrow(
                //     {
                //         ...arrow,
                //         points: [arrow?.points[0] || 0, arrow?.points[1] || 0, x, y]
                //     }
                // )

                break;

            case DrawAction.Circle:

                objects[index].circle = {
                    ...objects[index].circle!,
                    radius: ((x - objects[index].circle!.x) ** 2 + (y - objects[index].circle!.y) ** 2) ** 0.5,
                }

                setObjects([...objects])

                // setCircle(
                //     {
                //         ...circle!,
                //         radius: ((x - circle!.x) ** 2 + (y - circle!.y) ** 2) ** 0.5,
                //         // x:circle.x,
                //         // y:circle.y
                //     }
                // )
                break

            default:
                break;
        }

    }

    const onStageMouseUp = (evt: KonvaEventObject<MouseEvent>) => {

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

    const onClickShape = (event: KonvaEventObject<MouseEvent>) => {

        switch (drawMode) {
            case DrawAction.Select:
                transformerRef.current?.nodes([event.currentTarget])
                break;
        }

        return

    }

    useEffect(
        () => {
            if (canvasOuterRef.current) {

                setStagePpt(
                    {
                        height: canvasOuterRef.current?.offsetHeight - 2,
                        width: canvasOuterRef.current?.offsetWidth - 2,
                    }
                )

            }
        }, [canvasOuterRef.current]
    )

    const actionButtons: ActionButton[] = [
        {
            icon: <IconClick />,
            onClick: () => setDrawMode(DrawAction.Select),
            value: DrawAction.Select
        },
        {
            icon: <IconArrowUpLeftCircle />,
            onClick: () => setDrawMode(DrawAction.Arrow),
            value: DrawAction.Arrow
        },
        {
            icon: <IconCircle />,
            onClick: () => setDrawMode(DrawAction.Circle),
            value: DrawAction.Circle
        },
    ]

    return (
        <div className=' flex flex-col  w-full h-full '>
            <div className=' flex items-end gap-2'>
                {
                    actionButtons.map(
                        (button,index) => <button key={index} onClick={button.onClick} className={`p-1 border border-black ${button.value === drawMode ? 'bg-green-400' : ''}`}>{button.icon}</button>
                    )
                }
                <input type="file" accept='image/png,image/jpeg' onChange={imageOnchangeHandler} />
                <button className=' border border-gray-500 px-2 py-1 ' onClick={imageDowloadHandler} >Download image</button>
            </div>
            <div className='border border-black grow overflow-hidden flex'>
                <div ref={canvasOuterRef} className=' grow  overflow-auto'>
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
                            <KonvaRect
                                height={stagePpt.height}
                                width={stagePpt.width}
                                onClick={(e) => transformerRef.current?.nodes([])}
                            />
                            {
                                image &&
                                <KonvaImage
                                    key={'image'}
                                    image={image}
                                    width={stagePpt.width}
                                    height={stagePpt.height}
                                />
                            }
                            {
                                objects.map(
                                    object => {
                                        switch (object.type) {
                                            case objectType.Arrow:
                                                return (
                                                    <KonvaArrow
                                                        key={object.arrow!.id}
                                                        id={object.arrow!.id}
                                                        points={object.arrow!.points}
                                                        fill={object.arrow!.color}
                                                        stroke={object.arrow!.color}
                                                        strokeWidth={4}
                                                        onClick={onClickShape}
                                                        draggable={drawMode === DrawAction.Select}
                                                    />
                                                )
                                                break;
                                            case objectType.Circle:
                                                return <KonvaCircle
                                                    key={object.circle!.id}
                                                    id={object.circle!.id}
                                                    x={object.circle?.x}
                                                    y={object.circle?.y}
                                                    radius={object.circle?.radius}
                                                    stroke={object.circle?.color}
                                                    strokeWidth={4}
                                                    onClick={onClickShape}
                                                    draggable={drawMode === DrawAction.Select}
                                                />

                                            default:
                                                break;
                                        }
                                    }
                                )
                            }
                            {/* {
                                arrow &&
                                <KonvaArrow
                                    key={arrow.id}
                                    id={arrow.id}
                                    points={arrow.points}
                                    fill={arrow.color}
                                    stroke={arrow.color}
                                    strokeWidth={4}
                                    onClick={onClickShape}
                                    draggable={drawMode === DrawAction.Select}
                                />
                            } */}
                            {/* {
                                circle &&
                                <KonvaCircle
                                    key={circle.id}
                                    id={circle.id}
                                    x={circle?.x}
                                    y={circle?.y}
                                    radius={circle?.radius}
                                    stroke={circle?.color}
                                    strokeWidth={4}
                                    onClick={onClickShape}
                                    draggable={drawMode === DrawAction.Select}
                                />
                            } */}
                            <KonvaTransformer ref={transformerRef} />
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    )
}
