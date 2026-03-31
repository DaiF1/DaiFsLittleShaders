import { gl } from "./gl";

/* Found on WebGLFundamentals */
function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
  };
}


export class Mesh
{
    constructor(vertices, normals, uvs) {
        this.vertices = vertices;
        this.normals = normals;
        this.uvs = uvs;

        this.programCache = {};
    }

    createVAO(program) {
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        let posAttribLocation = gl.getAttribLocation(program, "a_position");
        if (posAttribLocation >= 0) {
            let posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(posAttribLocation);
            gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
        }

        let normalAttribLocation = gl.getAttribLocation(program, "a_normal");
        if (normalAttribLocation >= 0) {
            let normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(normalAttribLocation);
            gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, false, 0, 0);
        }

        let uvAttribLocation = gl.getAttribLocation(program, "a_uv");
        if (uvAttribLocation >= 0) {
            let uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(uvAttribLocation);
            gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        return vao;
    }

    draw(shader) {
        let vao = this.programCache[shader.id];
        if (vao == null) {
            vao = this.createVAO(shader.program);
            this.programCache[shader.id] = vao;
        }
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }

    static async fromOBJ(file) {
        const text = await (await fetch(file)).text();
        const data = parseOBJ(text);
        return new Mesh(data.position, data.normal, data.texcoord);
    }
};
