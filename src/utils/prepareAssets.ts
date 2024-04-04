
export type assetObjects = 'pdfjsLib'

type assetsType = {
    pdfjsLib:any
}

const assets:assetsType = {
    pdfjsLib:''
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
    

}