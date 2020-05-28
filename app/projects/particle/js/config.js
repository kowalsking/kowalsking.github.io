export const imagePaths = {
  spritesheet: "images/coin.json",
  art: [
    {
      framerate: 30,
      loop: false,
      textures: [
        "0001.png",
        "0002.png",
        "0003.png",
        "0004.png",
        "0005.png",
        "0006.png",
        "0007.png",
        "0008.png",
        "0009.png",
        "0010.png",
        "0011.png",
        "0012.png",
        "0013.png",
        "0014.png",
        "0015.png",
        "0016.png",
        "0017.png",
        "0018.png",
        "0019.png",
        "0020.png",
        "0021.png",
        "0022.png",
        "0023.png",
        "0024.png",
        "0025.png",
        "0026.png",
        "0027.png",
        "0028.png",
        "0029.png",
        "0030.png",
      ],
    },
    {
      framerate: 30,
      loop: false,
      textures: [
        "0030.png",
        "0029.png",
        "0028.png",
        "0027.png",
        "0026.png",
        "0025.png",
        "0024.png",
        "0023.png",
        "0022.png",
        "0021.png",
        "0020.png",
        "0019.png",
        "0018.png",
        "0017.png",
        "0016.png",
        "0015.png",
        "0014.png",
        "0013.png",
        "0012.png",
        "0011.png",
        "0010.png",
        "0009.png",
        "0008.png",
        "0007.png",
        "0006.png",
        "0005.png",
        "0004.png",
        "0003.png",
        "0002.png",
        "0001.png",
      ],
    },
  ],
};

export const particleConfig = {
  alpha: {
    start: 1,
    end: 1,
  },
  scale: {
    start: 0.45,
    end: 0.45,
    minimumScaleMultiplier: 0.5,
  },
  color: {
    start: "#ffffff",
    end: "#f9fcc0",
  },
  speed: {
    list: [
      {
        value: 500,
        time: 0,
      },
      {
        value: 0,
        time: 0.1,
      },
      {
        value: 0,
        time: 1,
      },
    ],
    isStepped: false,
    minimumSpeedMultiplier: 2.25,
  },
  acceleration: {
    x: 0,
    y: 2000,
  },
  startRotation: {
    min: 0,
    max: 360,
  },
  rotationSpeed: {
    min: 100,
    max: 200,
  },
  lifetime: {
    min: 1.5,
    max: 1.5,
  },
  blendMode: "normal",
  frequency: 0.001,
  emitterLifetime: 0.5,
  maxParticles: 70,
  pos: {
    x: 0,
    y: 0,
  },
  addAtBack: true,
  spawnType: "point",
};

export const bigwinList = {
  MMA: {
    name: "MMA",
    code: 123,
    path: "bigwin/MMA/big_win_animation.json",
    animation: "big_win_all",
    loopStartFrame: 28,
    loopEndFrame: 80,
  },
  dancing_lantern: {
    name: "Dancing Lantern",
    code: 291,
    path: "bigwin/291_Dancing Lanterns_BigWin.svn/big_win.json",
    animation: "big_win_all",
  },
  fruit_cash: {
    name: "Fruit Cash",
    code: 297,
    path: "bigwin/297_FruitCashHoldn'Link_BigWin/big_win.json",
    animation: "big_win_all",
  },
  book_of_nile: {
    name: "Book Of Nile",
    code: 340,
    path: "bigwin/340_BookOfNileLostChapter/big_win.json",
    animation: "big_win_all",
  },
  lotus_fortune: {
    name: "Lotus Fortune",
    code: 352,
    path: "bigwin/352_LotusFortune/big_win.json",
    animation: "big_win_all",
  },
};

export const animationSetup = {
  name: "MMA",
  type: "stretch", // stretch, loop
  duration: 10000,
  loops: 5,
};
