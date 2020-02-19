declare module 'georaster' {
  export default function parseGeoraster(data: ArrayBuffer): Promise<any>;
}