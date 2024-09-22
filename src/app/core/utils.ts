import {AsyncValidatorFn, FormControlOptions, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Field} from "./types/register-field";

export function getTimeZone() {
  const d = new Date();
  return -1 * d.getTimezoneOffset() / 60;
}

export function getDefaultRange(dayCount = 1)
{
  const d1 = new Date();
  d1.setDate(d1.getDate() - dayCount);
  const d2 = new Date();
  const diff:{FromDate:Date, ToDate:Date} = {FromDate:d1, ToDate:d2};
  return diff;
}

export function getDomain():string
{
  let hostname = window.location.hostname;
  if(hostname === "localhost")
    return "";
  let re=/[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{2,}|[-\w]+\.[-\w]{2})$/i;
  let tld:any = re.exec(hostname);
  return tld[0];
}

export function getValidatorsFromField(field:Field): ValidatorFn | ValidatorFn[] | FormControlOptions | null
{
  const validators = [];
  if(field.Config.required || field.Config.mandatory)
  {
    validators.push(field.Type === "checkbox" ? Validators.requiredTrue : Validators.required);
  }
  if(field.Config.regExp)
    validators.push(Validators.pattern(new RegExp(field.Config.regExp)));
  return validators;
}


export const paymentStatuses:any = {1:"Uncalculated",2:"Won", 3:"Lost",4:"Deleted",5:"Paid"};

