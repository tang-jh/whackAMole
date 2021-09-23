const game = {
  timeLeft: 60,
  difficulty: "",
  modeSetting: {
    "btn-easy": {
      duration: {
        min: 500,
        max: 2000,
      },
      delay: {
        min: 500,
        max: 2000,
      },
      provokeChance: 10,
      limit: 2,
    },
    "btn-normal": {
      duration: {
        min: 400,
        max: 1000,
      },
      delay: {
        min: 400,
        max: 1000,
      },
      provokeChance: 20,
      limit: 4,
    },
    "btn-hard": {
      duration: {
        min: 300,
        max: 600,
      },
      delay: {
        min: 300,
        max: 600,
      },
      provokeChance: 50,
      limit: 6,
    },
  },
  lastSprint: 5,
};

console.log(game.modeSetting["btn-hard"].limit);
