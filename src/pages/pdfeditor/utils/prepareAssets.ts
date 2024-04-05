
export type assetObjects = 'pdfjsLib'|'PDFLib'|'download'

type assetsType = {
    pdfjsLib:any,
    PDFLib:any,
    download:any
}

const assets:assetsType = {
    pdfjsLib:'',
    PDFLib:'',
    download:''
}

export const getAsset = (assetType:assetObjects)=>{
    return assets[assetType]
}

export const prepareAsset = ()=>{

    
        assets.pdfjsLib = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.min.js';
            script.onload = () => {
                resolve(window['pdfjsLib' as any]);
                console.log(`${'pdfjsLib'} is loaded.`);
            };
            script.onerror = () =>
                reject(`The script ${'pdfjsLib'} didn't load correctly.`);
            document.body.appendChild(script);
        })
        
        assets.PDFLib = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/pdf-lib@1.4.0/dist/pdf-lib.min.js';
            script.onload = () => {
                resolve(window['PDFLib' as any]);
                console.log(`${'PDFLib'} is loaded.`);
            };
            script.onerror = () =>
                reject(`The script ${'PDFLib'} didn't load correctly.`);
            document.body.appendChild(script);
        })

        assets.download = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/downloadjs@1.4.7';
            script.onload = () => {
                resolve(window['download' as any]);
                console.log(`${'download'} is loaded.`);
            };
            script.onerror = () =>
                reject(`The script ${'download'} didn't load correctly.`);
            document.body.appendChild(script);
        })
    

}