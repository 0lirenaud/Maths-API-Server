import Controller from './Controller.js';
import * as math from '../mathUtilities.js';

const errorMissingParameter = ' parameter is missing';
const errorTooManyParameter = 'too many parameters';
const errorParameterNotNumber = ' parameter is not a number';
const errorMustBeInteger = 'n parameter must be an integer > 0';
const errorInvalid = ' parameter is invalid';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    /// APPELER LA FONCTION await MATHS_API A CHAQUE TEST ET L'AFFICHER DANS LA SECTION TEST INDEX
    get() {
        const possibleOpForN = ['!', 'p', 'np'];
        const possibleOpGeneral = [' ', '-', '*', '/', '%'];

        let params = this.HttpContext.path.params;
        let rep = { };

        for(let key in params){
            if(key !== undefined)
                rep[key] = params[key];
        }

        if(!("op" in rep))
            rep["error"] = "op" + errorMissingParameter;
        else if(!possibleOpGeneral.includes(rep["op"]) && !possibleOpForN.includes(rep["op"]))
            rep["error"] = "op" + errorInvalid;
        else if(possibleOpForN.includes(rep["op"])) {
            let nMessage = this.validate(rep["n"], "n");

            if(nMessage != '')
                rep["error"] = nMessage
            else if(Object.keys(rep).length != 2)
                rep["error"] = errorTooManyParameter; 
            else {
                switch(rep["op"]){
                    case '!':
                        rep["value"] = math.factorial(rep["n"]);
                        break;
                    case 'p':
                        rep["value"] = math.isPrime(rep["n"]);
                        break;
                    case 'np':
                        rep["value"] = math.findPrime(rep["n"]);
                        break;
                }
            }
        }
        else {
            if(rep["op"] == ' ')
                rep["op"] = '+';

            let xMesssage = this.validate(rep['x'], "x");
            let yMessage = this.validate(rep['y'], "y");
            
            if(xMesssage != '')
                rep["error"] = xMesssage;
            else if(yMessage != '')
                rep["error"] = yMessage;
            else if(Object.keys(rep).length != 3)
                rep["error"] = errorTooManyParameter;
            else if(rep["op"] == '%') {
                rep["value"] = parseFloat(rep["x"]) % parseFloat(rep["y"]);
                rep["value"] = isNaN(rep["value"]) ? "NaN" : rep["value"];
            }
            else {
                rep["value"] = eval(rep["x"] + rep["op"] + rep["y"]);
                rep["value"] = !isFinite(rep["value"]) ? "Infinity" : rep["value"];
            }
        }

        if(rep["error"] !== undefined)
            this.HttpContext.response.unprocessable(rep);
        else
            this.HttpContext.response.JSON(rep);
    }

    validate(value, key) {
        if(value === undefined)
            return key + errorMissingParameter;
        if(!Number.isInteger(parseInt(value)))
            return key + errorParameterNotNumber;

        if(key == 'n')
            if(parseInt(value) <= 0 || !Number.isInteger(parseFloat(value)))
                return errorMustBeInteger

        return '';
    }
}