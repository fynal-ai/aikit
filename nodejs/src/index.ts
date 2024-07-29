import AiWorkClass from "./aiwork";
import ApmClass from "./apm";

process.env.APM_USERNAME ??
  (console.log("APM_USERNAME is not set"), process.exit(1));
process.env.APM_PASSWORD ??
  (console.log("APM_PASSWORD is not set"), process.exit(1));

export const AiWork = new AiWorkClass();
export const APM = new ApmClass(
  process.env.APM_USERNAME,
  process.env.APM_PASSWORD,
);

export const Fynal: { [key: string]: any } = {};

function mergeMethods(target: { [key: string]: any }, source: any) {
  Object.getOwnPropertyNames(Object.getPrototypeOf(source)).forEach((prop) => {
    if (
      typeof source[prop] === "function" &&
      ["constructor", "hello", "login"].indexOf(prop) === -1
    ) {
      target[prop] = source[prop].bind(source);
    }
  });
}

Fynal["sleep"] = async function (miliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, miliseconds));
};

mergeMethods(Fynal, AiWork);
mergeMethods(Fynal, APM);
Fynal["login"] = AiWork.login;
Fynal.APM = APM;
Fynal.AiWork = AiWork;

export default Fynal;
