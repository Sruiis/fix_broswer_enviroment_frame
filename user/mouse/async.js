debugger;

let loadEvent = FaustVM.memory.asyncEvent.listener["load"];
for(let i=0;i<loadEvent.length;i++){
    let self = loadEvent[i].self;
    let callBack = loadEvent[i].listener;
    callBack.call(self);
}
let setTimeoutFunc = FaustVM.memory.asyncEvent.setTimeout;
for(let i=0;i<setTimeoutFunc.length;i++){
    let callBack = setTimeoutFunc[i].callback;
    callBack()
}
debugger;

let mouseEvent = [
    {
        "clientX": 464,
        "clientY": 481,
        "timeStamp": 7780.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 445,
        "clientY": 475,
        "timeStamp": 7788.5,
        "type": "mousemove"
    },
    {
        "clientX": 433,
        "clientY": 471,
        "timeStamp": 7795.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 423,
        "clientY": 465,
        "timeStamp": 7804,
        "type": "mousemove"
    },
    {
        "clientX": 415,
        "clientY": 459,
        "timeStamp": 7811.9000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 410,
        "clientY": 450,
        "timeStamp": 7820,
        "type": "mousemove"
    },
    {
        "clientX": 402,
        "clientY": 440,
        "timeStamp": 7827.5999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 395,
        "clientY": 428,
        "timeStamp": 7835.9000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 387,
        "clientY": 410,
        "timeStamp": 7844.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 375,
        "clientY": 389,
        "timeStamp": 7852.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 361,
        "clientY": 365,
        "timeStamp": 7859.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 346,
        "clientY": 341,
        "timeStamp": 7868.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 332,
        "clientY": 316,
        "timeStamp": 7875.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 317,
        "clientY": 292,
        "timeStamp": 7883.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 305,
        "clientY": 269,
        "timeStamp": 7892.5999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 296,
        "clientY": 249,
        "timeStamp": 7899.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 289,
        "clientY": 231,
        "timeStamp": 7908.5,
        "type": "mousemove"
    },
    {
        "clientX": 286,
        "clientY": 218,
        "timeStamp": 7916.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 284,
        "clientY": 206,
        "timeStamp": 7924,
        "type": "mousemove"
    },
    {
        "clientX": 283,
        "clientY": 194,
        "timeStamp": 7932.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 283,
        "clientY": 187,
        "timeStamp": 7939.9000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 283,
        "clientY": 178,
        "timeStamp": 7948.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 285,
        "clientY": 172,
        "timeStamp": 7956,
        "type": "mousemove"
    },
    {
        "clientX": 289,
        "clientY": 167,
        "timeStamp": 7964.9000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 295,
        "clientY": 163,
        "timeStamp": 7972.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 302,
        "clientY": 159,
        "timeStamp": 7979.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 310,
        "clientY": 156,
        "timeStamp": 7989.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 320,
        "clientY": 155,
        "timeStamp": 7998,
        "type": "mousemove"
    },
    {
        "clientX": 330,
        "clientY": 155,
        "timeStamp": 8004,
        "type": "mousemove"
    },
    {
        "clientX": 340,
        "clientY": 157,
        "timeStamp": 8013.5999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 352,
        "clientY": 162,
        "timeStamp": 8020.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 364,
        "clientY": 173,
        "timeStamp": 8027.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 378,
        "clientY": 188,
        "timeStamp": 8035.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 388,
        "clientY": 206,
        "timeStamp": 8043.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 395,
        "clientY": 226,
        "timeStamp": 8053.5,
        "type": "mousemove"
    },
    {
        "clientX": 397,
        "clientY": 244,
        "timeStamp": 8060.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 396,
        "clientY": 259,
        "timeStamp": 8068.5,
        "type": "mousemove"
    },
    {
        "clientX": 390,
        "clientY": 274,
        "timeStamp": 8075.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 377,
        "clientY": 291,
        "timeStamp": 8083.9000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 362,
        "clientY": 305,
        "timeStamp": 8094.5999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 338,
        "clientY": 317,
        "timeStamp": 8100.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 313,
        "clientY": 328,
        "timeStamp": 8108.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 283,
        "clientY": 337,
        "timeStamp": 8116.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 252,
        "clientY": 340,
        "timeStamp": 8123.5,
        "type": "mousemove"
    },
    {
        "clientX": 221,
        "clientY": 342,
        "timeStamp": 8132.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 190,
        "clientY": 339,
        "timeStamp": 8139.9000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 161,
        "clientY": 333,
        "timeStamp": 8148.5,
        "type": "mousemove"
    },
    {
        "clientX": 141,
        "clientY": 324,
        "timeStamp": 8156.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 124,
        "clientY": 312,
        "timeStamp": 8164.4000000003725,
        "type": "mousemove"
    },
    {
        "clientX": 113,
        "clientY": 299,
        "timeStamp": 8172.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 101,
        "clientY": 280,
        "timeStamp": 8180.0999999996275,
        "type": "mousemove"
    },
    {
        "clientX": 94,
        "clientY": 258,
        "timeStamp": 8188.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 91,
        "clientY": 235,
        "timeStamp": 8197,
        "type": "mousemove"
    },
    {
        "clientX": 93,
        "clientY": 209,
        "timeStamp": 8203.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 101,
        "clientY": 185,
        "timeStamp": 8212.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 117,
        "clientY": 160,
        "timeStamp": 8219.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 140,
        "clientY": 141,
        "timeStamp": 8227.5,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 126,
        "timeStamp": 8235.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 192,
        "clientY": 116,
        "timeStamp": 8243.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 218,
        "clientY": 112,
        "timeStamp": 8251.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 243,
        "clientY": 112,
        "timeStamp": 8259.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 264,
        "clientY": 116,
        "timeStamp": 8267.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 287,
        "clientY": 125,
        "timeStamp": 8276.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 304,
        "clientY": 140,
        "timeStamp": 8283.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 318,
        "clientY": 161,
        "timeStamp": 8292.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 328,
        "clientY": 192,
        "timeStamp": 8299.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 334,
        "clientY": 228,
        "timeStamp": 8307.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 333,
        "clientY": 267,
        "timeStamp": 8315.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 324,
        "clientY": 307,
        "timeStamp": 8323.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 309,
        "clientY": 343,
        "timeStamp": 8331.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 292,
        "clientY": 373,
        "timeStamp": 8339.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 270,
        "clientY": 396,
        "timeStamp": 8347.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 248,
        "clientY": 413,
        "timeStamp": 8356.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 227,
        "clientY": 426,
        "timeStamp": 8363.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 207,
        "clientY": 433,
        "timeStamp": 8371.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 194,
        "clientY": 435,
        "timeStamp": 8380.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 187,
        "clientY": 435,
        "timeStamp": 8387.5,
        "type": "mousemove"
    },
    {
        "clientX": 180,
        "clientY": 435,
        "timeStamp": 8396.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 175,
        "clientY": 430,
        "timeStamp": 8406,
        "type": "mousemove"
    },
    {
        "clientX": 170,
        "clientY": 419,
        "timeStamp": 8411.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 401,
        "timeStamp": 8419.5,
        "type": "mousemove"
    },
    {
        "clientX": 161,
        "clientY": 378,
        "timeStamp": 8427.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 160,
        "clientY": 347,
        "timeStamp": 8436.5,
        "type": "mousemove"
    },
    {
        "clientX": 162,
        "clientY": 311,
        "timeStamp": 8444.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 167,
        "clientY": 277,
        "timeStamp": 8453.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 178,
        "clientY": 242,
        "timeStamp": 8460.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 194,
        "clientY": 210,
        "timeStamp": 8467.5,
        "type": "mousemove"
    },
    {
        "clientX": 211,
        "clientY": 183,
        "timeStamp": 8476,
        "type": "mousemove"
    },
    {
        "clientX": 231,
        "clientY": 166,
        "timeStamp": 8483.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 249,
        "clientY": 155,
        "timeStamp": 8492.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 266,
        "clientY": 150,
        "timeStamp": 8501.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 279,
        "clientY": 148,
        "timeStamp": 8508,
        "type": "mousemove"
    },
    {
        "clientX": 290,
        "clientY": 151,
        "timeStamp": 8515.5,
        "type": "mousemove"
    },
    {
        "clientX": 303,
        "clientY": 159,
        "timeStamp": 8524.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 318,
        "clientY": 179,
        "timeStamp": 8532.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 335,
        "clientY": 213,
        "timeStamp": 8540.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 349,
        "clientY": 251,
        "timeStamp": 8547.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 357,
        "clientY": 291,
        "timeStamp": 8556.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 357,
        "clientY": 329,
        "timeStamp": 8564.5,
        "type": "mousemove"
    },
    {
        "clientX": 352,
        "clientY": 374,
        "timeStamp": 8571.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 341,
        "clientY": 409,
        "timeStamp": 8580.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 326,
        "clientY": 438,
        "timeStamp": 8588.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 306,
        "clientY": 461,
        "timeStamp": 8595.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 289,
        "clientY": 475,
        "timeStamp": 8603.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 268,
        "clientY": 486,
        "timeStamp": 8611.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 252,
        "clientY": 491,
        "timeStamp": 8620,
        "type": "mousemove"
    },
    {
        "clientX": 238,
        "clientY": 492,
        "timeStamp": 8628.5,
        "type": "mousemove"
    },
    {
        "clientX": 225,
        "clientY": 491,
        "timeStamp": 8636.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 213,
        "clientY": 485,
        "timeStamp": 8644.5,
        "type": "mousemove"
    },
    {
        "clientX": 203,
        "clientY": 475,
        "timeStamp": 8652,
        "type": "mousemove"
    },
    {
        "clientX": 191,
        "clientY": 460,
        "timeStamp": 8660.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 182,
        "clientY": 437,
        "timeStamp": 8668.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 175,
        "clientY": 405,
        "timeStamp": 8675.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 172,
        "clientY": 366,
        "timeStamp": 8685.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 172,
        "clientY": 328,
        "timeStamp": 8692.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 176,
        "clientY": 283,
        "timeStamp": 8699.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 187,
        "clientY": 240,
        "timeStamp": 8708.5,
        "type": "mousemove"
    },
    {
        "clientX": 202,
        "clientY": 204,
        "timeStamp": 8716,
        "type": "mousemove"
    },
    {
        "clientX": 220,
        "clientY": 172,
        "timeStamp": 8723.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 239,
        "clientY": 152,
        "timeStamp": 8731.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 257,
        "clientY": 142,
        "timeStamp": 8740.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 273,
        "clientY": 137,
        "timeStamp": 8750.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 285,
        "clientY": 136,
        "timeStamp": 8755.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 301,
        "clientY": 138,
        "timeStamp": 8765,
        "type": "mousemove"
    },
    {
        "clientX": 320,
        "clientY": 150,
        "timeStamp": 8772.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 340,
        "clientY": 169,
        "timeStamp": 8783.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 361,
        "clientY": 196,
        "timeStamp": 8787.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 377,
        "clientY": 233,
        "timeStamp": 8797,
        "type": "mousemove"
    },
    {
        "clientX": 390,
        "clientY": 274,
        "timeStamp": 8804,
        "type": "mousemove"
    },
    {
        "clientX": 396,
        "clientY": 313,
        "timeStamp": 8812.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 396,
        "clientY": 348,
        "timeStamp": 8820.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 390,
        "clientY": 386,
        "timeStamp": 8828.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 378,
        "clientY": 416,
        "timeStamp": 8836.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 361,
        "clientY": 443,
        "timeStamp": 8844,
        "type": "mousemove"
    },
    {
        "clientX": 340,
        "clientY": 464,
        "timeStamp": 8851.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 313,
        "clientY": 479,
        "timeStamp": 8860,
        "type": "mousemove"
    },
    {
        "clientX": 286,
        "clientY": 489,
        "timeStamp": 8868.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 259,
        "clientY": 493,
        "timeStamp": 8875.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 240,
        "clientY": 495,
        "timeStamp": 8884.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 226,
        "clientY": 493,
        "timeStamp": 8893.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 215,
        "clientY": 488,
        "timeStamp": 8899.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 205,
        "clientY": 478,
        "timeStamp": 8909.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 196,
        "clientY": 459,
        "timeStamp": 8915.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 186,
        "clientY": 432,
        "timeStamp": 8924.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 181,
        "clientY": 392,
        "timeStamp": 8932.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 177,
        "clientY": 353,
        "timeStamp": 8940,
        "type": "mousemove"
    },
    {
        "clientX": 181,
        "clientY": 311,
        "timeStamp": 8948.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 189,
        "clientY": 266,
        "timeStamp": 8955.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 204,
        "clientY": 223,
        "timeStamp": 8963.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 223,
        "clientY": 186,
        "timeStamp": 8972.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 245,
        "clientY": 160,
        "timeStamp": 8979.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 264,
        "clientY": 145,
        "timeStamp": 8988.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 279,
        "clientY": 139,
        "timeStamp": 8995.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 290,
        "clientY": 139,
        "timeStamp": 9004,
        "type": "mousemove"
    },
    {
        "clientX": 306,
        "clientY": 143,
        "timeStamp": 9012.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 323,
        "clientY": 155,
        "timeStamp": 9020.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 345,
        "clientY": 183,
        "timeStamp": 9027.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 368,
        "clientY": 221,
        "timeStamp": 9037.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 383,
        "clientY": 270,
        "timeStamp": 9044.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 391,
        "clientY": 328,
        "timeStamp": 9051.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 390,
        "clientY": 385,
        "timeStamp": 9061.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 381,
        "clientY": 438,
        "timeStamp": 9067.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 361,
        "clientY": 485,
        "timeStamp": 9075.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 336,
        "clientY": 526,
        "timeStamp": 9083.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 309,
        "clientY": 557,
        "timeStamp": 9093.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 276,
        "clientY": 582,
        "timeStamp": 9100.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 244,
        "clientY": 600,
        "timeStamp": 9110.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 216,
        "clientY": 612,
        "timeStamp": 9115.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 197,
        "clientY": 616,
        "timeStamp": 9124.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 188,
        "clientY": 616,
        "timeStamp": 9132,
        "type": "mousemove"
    },
    {
        "clientX": 177,
        "clientY": 613,
        "timeStamp": 9140.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 168,
        "clientY": 605,
        "timeStamp": 9148.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 159,
        "clientY": 588,
        "timeStamp": 9156,
        "type": "mousemove"
    },
    {
        "clientX": 149,
        "clientY": 555,
        "timeStamp": 9163.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 139,
        "clientY": 515,
        "timeStamp": 9172,
        "type": "mousemove"
    },
    {
        "clientX": 136,
        "clientY": 463,
        "timeStamp": 9179.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 140,
        "clientY": 408,
        "timeStamp": 9189.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 150,
        "clientY": 357,
        "timeStamp": 9196.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 308,
        "timeStamp": 9204.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 185,
        "clientY": 269,
        "timeStamp": 9212,
        "type": "mousemove"
    },
    {
        "clientX": 206,
        "clientY": 236,
        "timeStamp": 9219.5,
        "type": "mousemove"
    },
    {
        "clientX": 227,
        "clientY": 217,
        "timeStamp": 9227.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 240,
        "clientY": 209,
        "timeStamp": 9236.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 250,
        "clientY": 206,
        "timeStamp": 9244.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 258,
        "clientY": 207,
        "timeStamp": 9252.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 267,
        "clientY": 213,
        "timeStamp": 9260.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 276,
        "clientY": 226,
        "timeStamp": 9268.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 288,
        "clientY": 252,
        "timeStamp": 9276.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 300,
        "clientY": 288,
        "timeStamp": 9283.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 312,
        "clientY": 333,
        "timeStamp": 9291.5,
        "type": "mousemove"
    },
    {
        "clientX": 317,
        "clientY": 383,
        "timeStamp": 9299.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 321,
        "clientY": 438,
        "timeStamp": 9308.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 323,
        "clientY": 490,
        "timeStamp": 9315.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 322,
        "clientY": 534,
        "timeStamp": 9324,
        "type": "mousemove"
    },
    {
        "clientX": 315,
        "clientY": 579,
        "timeStamp": 9331.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 305,
        "clientY": 624,
        "timeStamp": 9339.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 290,
        "clientY": 668,
        "timeStamp": 9348.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 276,
        "clientY": 704,
        "timeStamp": 9356.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 260,
        "clientY": 738,
        "timeStamp": 9364.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 248,
        "clientY": 759,
        "timeStamp": 9372.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 239,
        "clientY": 773,
        "timeStamp": 9380.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 232,
        "clientY": 782,
        "timeStamp": 9389,
        "type": "mousemove"
    },
    {
        "clientX": 229,
        "clientY": 785,
        "timeStamp": 9396,
        "type": "mousemove"
    },
    {
        "clientX": 227,
        "clientY": 786,
        "timeStamp": 9405.5,
        "type": "mousemove"
    },
    {
        "clientX": 225,
        "clientY": 783,
        "timeStamp": 9420,
        "type": "mousemove"
    },
    {
        "clientX": 222,
        "clientY": 771,
        "timeStamp": 9428.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 217,
        "clientY": 748,
        "timeStamp": 9439.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 209,
        "clientY": 703,
        "timeStamp": 9443.5,
        "type": "mousemove"
    },
    {
        "clientX": 203,
        "clientY": 648,
        "timeStamp": 9453.5,
        "type": "mousemove"
    },
    {
        "clientX": 201,
        "clientY": 591,
        "timeStamp": 9459.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 199,
        "clientY": 531,
        "timeStamp": 9468.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 199,
        "clientY": 471,
        "timeStamp": 9476.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 199,
        "clientY": 412,
        "timeStamp": 9485,
        "type": "mousemove"
    },
    {
        "clientX": 199,
        "clientY": 355,
        "timeStamp": 9491.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 199,
        "clientY": 303,
        "timeStamp": 9501.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 199,
        "clientY": 260,
        "timeStamp": 9507.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 202,
        "clientY": 226,
        "timeStamp": 9517.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 204,
        "clientY": 206,
        "timeStamp": 9523.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 207,
        "clientY": 195,
        "timeStamp": 9532.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 207,
        "clientY": 191,
        "timeStamp": 9541.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 208,
        "clientY": 189,
        "timeStamp": 9549.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 209,
        "clientY": 189,
        "timeStamp": 9555.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 211,
        "clientY": 193,
        "timeStamp": 9564.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 215,
        "clientY": 205,
        "timeStamp": 9572.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 225,
        "clientY": 231,
        "timeStamp": 9580.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 241,
        "clientY": 280,
        "timeStamp": 9588.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 255,
        "clientY": 337,
        "timeStamp": 9596.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 272,
        "clientY": 398,
        "timeStamp": 9604.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 286,
        "clientY": 465,
        "timeStamp": 9612.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 299,
        "clientY": 529,
        "timeStamp": 9620.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 305,
        "clientY": 595,
        "timeStamp": 9628.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 309,
        "clientY": 658,
        "timeStamp": 9635.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 309,
        "clientY": 707,
        "timeStamp": 9644.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 304,
        "clientY": 757,
        "timeStamp": 9651.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 297,
        "clientY": 796,
        "timeStamp": 9659.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 289,
        "clientY": 829,
        "timeStamp": 9667.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 278,
        "clientY": 852,
        "timeStamp": 9676.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 271,
        "clientY": 863,
        "timeStamp": 9684.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 265,
        "clientY": 869,
        "timeStamp": 9691.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 260,
        "clientY": 870,
        "timeStamp": 9700.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 255,
        "clientY": 869,
        "timeStamp": 9708,
        "type": "mousemove"
    },
    {
        "clientX": 247,
        "clientY": 861,
        "timeStamp": 9716.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 235,
        "clientY": 843,
        "timeStamp": 9723.5,
        "type": "mousemove"
    },
    {
        "clientX": 215,
        "clientY": 811,
        "timeStamp": 9733.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 195,
        "clientY": 772,
        "timeStamp": 9740.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 171,
        "clientY": 721,
        "timeStamp": 9748.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 148,
        "clientY": 664,
        "timeStamp": 9757.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 129,
        "clientY": 596,
        "timeStamp": 9764.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 112,
        "clientY": 532,
        "timeStamp": 9772,
        "type": "mousemove"
    },
    {
        "clientX": 96,
        "clientY": 467,
        "timeStamp": 9779.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 79,
        "clientY": 403,
        "timeStamp": 9788.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 71,
        "clientY": 339,
        "timeStamp": 9796.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 69,
        "clientY": 287,
        "timeStamp": 9804.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 70,
        "clientY": 244,
        "timeStamp": 9813.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 76,
        "clientY": 212,
        "timeStamp": 9819.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 87,
        "clientY": 188,
        "timeStamp": 9828.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 97,
        "clientY": 177,
        "timeStamp": 9835.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 107,
        "clientY": 171,
        "timeStamp": 9845.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 119,
        "clientY": 169,
        "timeStamp": 9852.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 131,
        "clientY": 169,
        "timeStamp": 9860,
        "type": "mousemove"
    },
    {
        "clientX": 146,
        "clientY": 174,
        "timeStamp": 9867.5,
        "type": "mousemove"
    },
    {
        "clientX": 174,
        "clientY": 193,
        "timeStamp": 9877.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 200,
        "clientY": 219,
        "timeStamp": 9884,
        "type": "mousemove"
    },
    {
        "clientX": 226,
        "clientY": 255,
        "timeStamp": 9892.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 252,
        "clientY": 302,
        "timeStamp": 9899.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 275,
        "clientY": 357,
        "timeStamp": 9907.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 291,
        "clientY": 417,
        "timeStamp": 9916.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 303,
        "clientY": 478,
        "timeStamp": 9925.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 309,
        "clientY": 536,
        "timeStamp": 9932.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 311,
        "clientY": 588,
        "timeStamp": 9940,
        "type": "mousemove"
    },
    {
        "clientX": 311,
        "clientY": 631,
        "timeStamp": 9947.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 307,
        "clientY": 676,
        "timeStamp": 9956.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 296,
        "clientY": 714,
        "timeStamp": 9963.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 284,
        "clientY": 744,
        "timeStamp": 9972.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 267,
        "clientY": 769,
        "timeStamp": 9980.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 251,
        "clientY": 787,
        "timeStamp": 9987.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 232,
        "clientY": 800,
        "timeStamp": 9996,
        "type": "mousemove"
    },
    {
        "clientX": 212,
        "clientY": 807,
        "timeStamp": 10004.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 197,
        "clientY": 809,
        "timeStamp": 10012.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 185,
        "clientY": 809,
        "timeStamp": 10019.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 174,
        "clientY": 804,
        "timeStamp": 10027.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 162,
        "clientY": 794,
        "timeStamp": 10035.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 148,
        "clientY": 777,
        "timeStamp": 10043.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 130,
        "clientY": 745,
        "timeStamp": 10051.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 115,
        "clientY": 707,
        "timeStamp": 10059.5,
        "type": "mousemove"
    },
    {
        "clientX": 102,
        "clientY": 661,
        "timeStamp": 10067.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 92,
        "clientY": 613,
        "timeStamp": 10076.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 88,
        "clientY": 563,
        "timeStamp": 10084,
        "type": "mousemove"
    },
    {
        "clientX": 91,
        "clientY": 511,
        "timeStamp": 10092,
        "type": "mousemove"
    },
    {
        "clientX": 99,
        "clientY": 458,
        "timeStamp": 10099.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 115,
        "clientY": 404,
        "timeStamp": 10108.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 135,
        "clientY": 352,
        "timeStamp": 10116.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 161,
        "clientY": 304,
        "timeStamp": 10124,
        "type": "mousemove"
    },
    {
        "clientX": 188,
        "clientY": 263,
        "timeStamp": 10131.5,
        "type": "mousemove"
    },
    {
        "clientX": 214,
        "clientY": 233,
        "timeStamp": 10140,
        "type": "mousemove"
    },
    {
        "clientX": 234,
        "clientY": 214,
        "timeStamp": 10147.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 244,
        "clientY": 207,
        "timeStamp": 10156,
        "type": "mousemove"
    },
    {
        "clientX": 250,
        "clientY": 205,
        "timeStamp": 10164.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 253,
        "clientY": 205,
        "timeStamp": 10172.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 257,
        "clientY": 209,
        "timeStamp": 10180.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 261,
        "clientY": 221,
        "timeStamp": 10188.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 263,
        "clientY": 244,
        "timeStamp": 10195.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 265,
        "clientY": 277,
        "timeStamp": 10203.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 267,
        "clientY": 315,
        "timeStamp": 10212.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 264,
        "clientY": 357,
        "timeStamp": 10219.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 255,
        "clientY": 397,
        "timeStamp": 10228.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 242,
        "clientY": 438,
        "timeStamp": 10237.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 228,
        "clientY": 469,
        "timeStamp": 10243.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 215,
        "clientY": 492,
        "timeStamp": 10251.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 204,
        "clientY": 511,
        "timeStamp": 10259.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 196,
        "clientY": 523,
        "timeStamp": 10268.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 191,
        "clientY": 530,
        "timeStamp": 10276.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 186,
        "clientY": 533,
        "timeStamp": 10285,
        "type": "mousemove"
    },
    {
        "clientX": 184,
        "clientY": 533,
        "timeStamp": 10292,
        "type": "mousemove"
    },
    {
        "clientX": 181,
        "clientY": 528,
        "timeStamp": 10302.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 178,
        "clientY": 514,
        "timeStamp": 10307.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 177,
        "clientY": 499,
        "timeStamp": 10318.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 176,
        "clientY": 483,
        "timeStamp": 10323.5,
        "type": "mousemove"
    },
    {
        "clientX": 176,
        "clientY": 471,
        "timeStamp": 10331.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 176,
        "clientY": 459,
        "timeStamp": 10339.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 174,
        "clientY": 446,
        "timeStamp": 10348.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 173,
        "clientY": 438,
        "timeStamp": 10355.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 172,
        "clientY": 432,
        "timeStamp": 10364,
        "type": "mousemove"
    },
    {
        "clientX": 171,
        "clientY": 426,
        "timeStamp": 10372.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 168,
        "clientY": 420,
        "timeStamp": 10379.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 419,
        "timeStamp": 10396.5,
        "type": "mousemove"
    },
    {
        "clientX": 164,
        "clientY": 418,
        "timeStamp": 10403.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 163,
        "clientY": 418,
        "timeStamp": 10412,
        "type": "mousemove"
    },
    {
        "clientX": 161,
        "clientY": 418,
        "timeStamp": 10419.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 159,
        "clientY": 418,
        "timeStamp": 10427.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 161,
        "clientY": 418,
        "timeStamp": 10452.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 164,
        "clientY": 419,
        "timeStamp": 10460.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 419,
        "timeStamp": 10467.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 420,
        "timeStamp": 10476.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 421,
        "timeStamp": 10572.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 422,
        "timeStamp": 10836.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 423,
        "timeStamp": 11084.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 424,
        "timeStamp": 11100.5,
        "type": "mousemove"
    },
    {
        "clientX": 167,
        "clientY": 426,
        "timeStamp": 11116.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 167,
        "clientY": 427,
        "timeStamp": 11132.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 167,
        "clientY": 428,
        "timeStamp": 11148.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 167,
        "clientY": 429,
        "timeStamp": 11156.5,
        "type": "mousemove"
    },
    {
        "clientX": 167,
        "clientY": 430,
        "timeStamp": 11172.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 168,
        "clientY": 430,
        "timeStamp": 11179.5,
        "type": "mousemove"
    },
    {
        "clientX": 168,
        "clientY": 431,
        "timeStamp": 11195.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 169,
        "clientY": 433,
        "timeStamp": 11204.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 170,
        "clientY": 435,
        "timeStamp": 11222.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 171,
        "clientY": 436,
        "timeStamp": 11236.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 172,
        "clientY": 437,
        "timeStamp": 11243.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 172,
        "clientY": 438,
        "timeStamp": 11268,
        "type": "mousemove"
    },
    {
        "clientX": 173,
        "clientY": 438,
        "timeStamp": 11276.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 173,
        "clientY": 439,
        "timeStamp": 11291.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 174,
        "clientY": 441,
        "timeStamp": 11300.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 175,
        "clientY": 442,
        "timeStamp": 11308.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 178,
        "clientY": 444,
        "timeStamp": 11317.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 184,
        "clientY": 447,
        "timeStamp": 11324.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 190,
        "clientY": 451,
        "timeStamp": 11332,
        "type": "mousemove"
    },
    {
        "clientX": 198,
        "clientY": 457,
        "timeStamp": 11340.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 208,
        "clientY": 462,
        "timeStamp": 11348.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 221,
        "clientY": 471,
        "timeStamp": 11355.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 240,
        "clientY": 482,
        "timeStamp": 11364.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 262,
        "clientY": 496,
        "timeStamp": 11373.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 291,
        "clientY": 511,
        "timeStamp": 11380.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 321,
        "clientY": 533,
        "timeStamp": 11388.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 349,
        "clientY": 555,
        "timeStamp": 11396,
        "type": "mousemove"
    },
    {
        "clientX": 372,
        "clientY": 579,
        "timeStamp": 11404.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 388,
        "clientY": 601,
        "timeStamp": 11411.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 397,
        "clientY": 617,
        "timeStamp": 11420.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 400,
        "clientY": 628,
        "timeStamp": 11428.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 400,
        "clientY": 636,
        "timeStamp": 11436.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 395,
        "clientY": 643,
        "timeStamp": 11443.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 387,
        "clientY": 649,
        "timeStamp": 11452.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 373,
        "clientY": 653,
        "timeStamp": 11460.5,
        "type": "mousemove"
    },
    {
        "clientX": 357,
        "clientY": 656,
        "timeStamp": 11468.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 341,
        "clientY": 656,
        "timeStamp": 11475.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 318,
        "clientY": 654,
        "timeStamp": 11484.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 297,
        "clientY": 651,
        "timeStamp": 11492.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 281,
        "clientY": 647,
        "timeStamp": 11500.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 267,
        "clientY": 643,
        "timeStamp": 11507.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 255,
        "clientY": 638,
        "timeStamp": 11515.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 244,
        "clientY": 633,
        "timeStamp": 11523.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 235,
        "clientY": 625,
        "timeStamp": 11532.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 226,
        "clientY": 613,
        "timeStamp": 11540,
        "type": "mousemove"
    },
    {
        "clientX": 216,
        "clientY": 597,
        "timeStamp": 11547.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 206,
        "clientY": 577,
        "timeStamp": 11555.5,
        "type": "mousemove"
    },
    {
        "clientX": 198,
        "clientY": 552,
        "timeStamp": 11563.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 192,
        "clientY": 528,
        "timeStamp": 11572.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 188,
        "clientY": 501,
        "timeStamp": 11580,
        "type": "mousemove"
    },
    {
        "clientX": 183,
        "clientY": 478,
        "timeStamp": 11587.5,
        "type": "mousemove"
    },
    {
        "clientX": 181,
        "clientY": 460,
        "timeStamp": 11595.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 180,
        "clientY": 447,
        "timeStamp": 11603.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 180,
        "clientY": 436,
        "timeStamp": 11611.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 181,
        "clientY": 428,
        "timeStamp": 11619.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 182,
        "clientY": 423,
        "timeStamp": 11627.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 185,
        "clientY": 420,
        "timeStamp": 11636,
        "type": "mousemove"
    },
    {
        "clientX": 187,
        "clientY": 418,
        "timeStamp": 11644.5,
        "type": "mousemove"
    },
    {
        "clientX": 189,
        "clientY": 417,
        "timeStamp": 11652.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 191,
        "clientY": 417,
        "timeStamp": 11659.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 193,
        "clientY": 420,
        "timeStamp": 11667.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 197,
        "clientY": 428,
        "timeStamp": 11676.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 204,
        "clientY": 444,
        "timeStamp": 11683.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 213,
        "clientY": 472,
        "timeStamp": 11692.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 220,
        "clientY": 503,
        "timeStamp": 11700.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 225,
        "clientY": 538,
        "timeStamp": 11707.5,
        "type": "mousemove"
    },
    {
        "clientX": 227,
        "clientY": 568,
        "timeStamp": 11716.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 226,
        "clientY": 593,
        "timeStamp": 11723.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 224,
        "clientY": 616,
        "timeStamp": 11732.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 220,
        "clientY": 635,
        "timeStamp": 11739.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 212,
        "clientY": 650,
        "timeStamp": 11747.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 205,
        "clientY": 661,
        "timeStamp": 11755.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 196,
        "clientY": 670,
        "timeStamp": 11764.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 187,
        "clientY": 676,
        "timeStamp": 11771.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 177,
        "clientY": 679,
        "timeStamp": 11779.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 680,
        "timeStamp": 11787.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 157,
        "clientY": 679,
        "timeStamp": 11796,
        "type": "mousemove"
    },
    {
        "clientX": 148,
        "clientY": 676,
        "timeStamp": 11804.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 141,
        "clientY": 669,
        "timeStamp": 11811.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 134,
        "clientY": 661,
        "timeStamp": 11820.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 130,
        "clientY": 650,
        "timeStamp": 11828.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 125,
        "clientY": 636,
        "timeStamp": 11836.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 122,
        "clientY": 615,
        "timeStamp": 11845.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 121,
        "clientY": 595,
        "timeStamp": 11852,
        "type": "mousemove"
    },
    {
        "clientX": 122,
        "clientY": 573,
        "timeStamp": 11862.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 129,
        "clientY": 548,
        "timeStamp": 11867.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 142,
        "clientY": 522,
        "timeStamp": 11876.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 160,
        "clientY": 500,
        "timeStamp": 11884.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 187,
        "clientY": 481,
        "timeStamp": 11892.5,
        "type": "mousemove"
    },
    {
        "clientX": 216,
        "clientY": 467,
        "timeStamp": 11900.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 245,
        "clientY": 461,
        "timeStamp": 11908.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 267,
        "clientY": 461,
        "timeStamp": 11916.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 294,
        "clientY": 466,
        "timeStamp": 11923.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 317,
        "clientY": 479,
        "timeStamp": 11932.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 338,
        "clientY": 498,
        "timeStamp": 11940.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 355,
        "clientY": 525,
        "timeStamp": 11948,
        "type": "mousemove"
    },
    {
        "clientX": 365,
        "clientY": 557,
        "timeStamp": 11959.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 367,
        "clientY": 588,
        "timeStamp": 11963.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 363,
        "clientY": 619,
        "timeStamp": 11972.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 353,
        "clientY": 645,
        "timeStamp": 11979.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 342,
        "clientY": 661,
        "timeStamp": 11989.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 332,
        "clientY": 671,
        "timeStamp": 11995.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 321,
        "clientY": 677,
        "timeStamp": 12003.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 309,
        "clientY": 679,
        "timeStamp": 12012.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 297,
        "clientY": 679,
        "timeStamp": 12020.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 278,
        "clientY": 676,
        "timeStamp": 12028.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 253,
        "clientY": 668,
        "timeStamp": 12036.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 225,
        "clientY": 655,
        "timeStamp": 12044,
        "type": "mousemove"
    },
    {
        "clientX": 196,
        "clientY": 639,
        "timeStamp": 12052.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 169,
        "clientY": 623,
        "timeStamp": 12060,
        "type": "mousemove"
    },
    {
        "clientX": 146,
        "clientY": 603,
        "timeStamp": 12067.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 130,
        "clientY": 585,
        "timeStamp": 12075.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 122,
        "clientY": 570,
        "timeStamp": 12083.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 121,
        "clientY": 558,
        "timeStamp": 12091.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 124,
        "clientY": 547,
        "timeStamp": 12099.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 132,
        "clientY": 537,
        "timeStamp": 12108.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 142,
        "clientY": 527,
        "timeStamp": 12115.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 152,
        "clientY": 520,
        "timeStamp": 12125.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 517,
        "timeStamp": 12131.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 171,
        "clientY": 515,
        "timeStamp": 12139.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 173,
        "clientY": 514,
        "timeStamp": 12148.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 175,
        "clientY": 514,
        "timeStamp": 12156.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 176,
        "clientY": 514,
        "timeStamp": 12171.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 178,
        "clientY": 513,
        "timeStamp": 12340.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 183,
        "clientY": 512,
        "timeStamp": 12349,
        "type": "mousemove"
    },
    {
        "clientX": 194,
        "clientY": 509,
        "timeStamp": 12356.5,
        "type": "mousemove"
    },
    {
        "clientX": 214,
        "clientY": 501,
        "timeStamp": 12363.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 248,
        "clientY": 494,
        "timeStamp": 12371.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 283,
        "clientY": 489,
        "timeStamp": 12379.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 313,
        "clientY": 487,
        "timeStamp": 12388.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 351,
        "clientY": 487,
        "timeStamp": 12396.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 402,
        "clientY": 487,
        "timeStamp": 12404.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 459,
        "clientY": 487,
        "timeStamp": 12411.5,
        "type": "mousemove"
    },
    {
        "clientX": 487,
        "clientY": 822,
        "timeStamp": 14060,
        "type": "mousemove"
    },
    {
        "clientX": 448,
        "clientY": 793,
        "timeStamp": 14067.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 407,
        "clientY": 760,
        "timeStamp": 14075.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 363,
        "clientY": 726,
        "timeStamp": 14083.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 324,
        "clientY": 695,
        "timeStamp": 14092.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 289,
        "clientY": 669,
        "timeStamp": 14100,
        "type": "mousemove"
    },
    {
        "clientX": 258,
        "clientY": 643,
        "timeStamp": 14108.5,
        "type": "mousemove"
    },
    {
        "clientX": 230,
        "clientY": 619,
        "timeStamp": 14117.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 208,
        "clientY": 596,
        "timeStamp": 14124.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 193,
        "clientY": 576,
        "timeStamp": 14133.5,
        "type": "mousemove"
    },
    {
        "clientX": 183,
        "clientY": 562,
        "timeStamp": 14140.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 174,
        "clientY": 548,
        "timeStamp": 14148.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 168,
        "clientY": 538,
        "timeStamp": 14157.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 162,
        "clientY": 530,
        "timeStamp": 14166.5,
        "type": "mousemove"
    },
    {
        "clientX": 158,
        "clientY": 524,
        "timeStamp": 14171.400000000373,
        "type": "mousemove"
    },
    {
        "clientX": 155,
        "clientY": 519,
        "timeStamp": 14185.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 155,
        "clientY": 516,
        "timeStamp": 14188.200000001118,
        "type": "mousemove"
    },
    {
        "clientX": 154,
        "clientY": 514,
        "timeStamp": 14198.5,
        "type": "mousemove"
    },
    {
        "clientX": 154,
        "clientY": 513,
        "timeStamp": 14203.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 154,
        "clientY": 511,
        "timeStamp": 14211.5,
        "type": "mousemove"
    },
    {
        "clientX": 154,
        "clientY": 508,
        "timeStamp": 14219.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 155,
        "clientY": 506,
        "timeStamp": 14227.5,
        "type": "mousemove"
    },
    {
        "clientX": 157,
        "clientY": 503,
        "timeStamp": 14236,
        "type": "mousemove"
    },
    {
        "clientX": 158,
        "clientY": 498,
        "timeStamp": 14243.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 160,
        "clientY": 495,
        "timeStamp": 14251.900000000373,
        "type": "mousemove"
    },
    {
        "clientX": 162,
        "clientY": 492,
        "timeStamp": 14260.300000000745,
        "type": "mousemove"
    },
    {
        "clientX": 162,
        "clientY": 490,
        "timeStamp": 14268.700000001118,
        "type": "mousemove"
    },
    {
        "clientX": 164,
        "clientY": 487,
        "timeStamp": 14276,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 486,
        "timeStamp": 14283.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 165,
        "clientY": 485,
        "timeStamp": 14292.099999999627,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 485,
        "timeStamp": 14299.599999999627,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 484,
        "timeStamp": 14308,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 484,
        "timeStamp": 14497.900000000373,
        "type": "mousedown"
    },
    {
        "clientX": 166,
        "clientY": 484,
        "timeStamp": 14506.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 484,
        "timeStamp": 14515.800000000745,
        "type": "mousemove"
    },
    {
        "clientX": 166,
        "clientY": 484,
        "timeStamp": 14555.800000000745,
        "type": "mouseup"
    }
];

for(let i=0;i<mouseEvent.length;i++){
    let event = mouseEvent[i];
    let type = event.type;
    let mouseEventObj = {
        "isTrusted": true
    };
    mouseEventObj = FaustVM.toolsFunc.createProxyObj(mouseEventObj, MouseEvent, "mouseEvent");
    FaustVM.toolsFunc.setProtoArr.call(mouseEventObj, "clientX", event.clientX);
    FaustVM.toolsFunc.setProtoArr.call(mouseEventObj, "clientY", event.clientY);
    FaustVM.toolsFunc.setProtoArr.call(mouseEventObj, "timeStamp", event.timeStamp);
    FaustVM.toolsFunc.setProtoArr.call(mouseEventObj, "type", event.type);
    let listenerList = FaustVM.memory.asyncEvent.listener[type];
    for(let j=0;j<listenerList.length;j++){
        let callBack = listenerList[j].listener;
        let self = listenerList[j].self;
        callBack.call(self, mouseEventObj);
    }
}