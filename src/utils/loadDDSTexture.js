import { gl } from "../renderer/gl";

// I currently only need these 2, but the whole list is here:
// https://learn.microsoft.com/fr-fr/windows/win32/api/dxgiformat/ne-dxgiformat-dxgi_format
const DXGI_FORMAT = {
    R32G32B32A32_FLOAT: 2,
    R16G16_FLOAT: 34
};

const DDS_MAGIC          = 0x20534444; // "DDS "
const DX10_FOURCC        = 0x30315844; // "DX10"
const DDS_HEADER_SIZE    = 124;
const DX10_HEADER_SIZE   = 20;
const DDS_DATA_OFFSET    = 4 + DDS_HEADER_SIZE + DX10_HEADER_SIZE; // 148
const DX10_MISC_TEXCUBE  = 0x4;

// Currently only works with DX10
export function parseDDS(buffer) {
    // Put here because we need to wait for gl to be initialized
    const GL_FORMATS = {
        [DXGI_FORMAT.R32G32B32A32_FLOAT]: { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT, dataType: Float32Array, bytesPerPixel: 16 },
        [DXGI_FORMAT.R16G16_FLOAT]: { internalFormat: gl.RG16F, format: gl.RG, type: gl.HALF_FLOAT, dataType: Uint16Array,  bytesPerPixel: 4  },
    };

    const dv  = new DataView(buffer);
    const u32 = (off) => dv.getUint32(off, true);

    if (u32(0) !== DDS_MAGIC)
        throw new Error('Error: not a DDS file');

    const pfFourCC = u32(84); // DDS_PIXELFORMAT.dwFourCC
    if (pfFourCC !== DX10_FOURCC)
        throw new Error(`Error: not a DX10 DDS file (${pfFourCC.toString(16)})`);

    const dxgiFormat = u32(128);
    const glFormat   = GL_FORMATS[dxgiFormat];
    if (!glFormat)
        throw new Error(`Error: format not in list (${dxgiFormat})`);

    const isCubemap = u32(136) === DX10_MISC_TEXCUBE;
    const numFaces  = isCubemap ? 6 : 1;
    const mipCount  = u32(28) || 1;
    const width     = u32(16);
    const height    = u32(12);

    const mipByteSize = (w, h) => w * h * glFormat.bytesPerPixel;

    const faces = Array.from({ length: numFaces }, () => []);
    let offset = DDS_DATA_OFFSET;

    for (let face = 0; face < numFaces; face++) {
        let w = width, h = height;
        for (let level = 0; level < mipCount; level++) {
            const byteLen = mipByteSize(w, h);
            faces[face].push({
                data:   new glFormat.dataType(buffer, offset, byteLen / glFormat.dataType.BYTES_PER_ELEMENT),
                width:  w,
                height: h,
            });
            offset += byteLen;
            w = Math.max(1, w >> 1);
            h = Math.max(1, h >> 1);
        }
    }
    return { isCubemap, faces, glFormat };
}
