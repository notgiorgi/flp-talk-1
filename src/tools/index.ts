export const trackDown = ({ target }: { target: string }) => {
  console.log(`Tracking down ${target}! 🕵️‍♂️`);
  return {
    location: "at his goomahs",
    ok: true,
    code: 200,
  };
};

export const whack = ({ target }: { target: string }) => {
  console.log(`Whacking ${target}! 🔫💥`);
  return {
    ok: true,
    code: 200,
  };
};

export const eatSandwich = ({ type }: { type: string }) => {
  console.log(`Eating ${type} sandwich! 🍔`);
  return {
    ok: true,
    code: 200,
  };
};
