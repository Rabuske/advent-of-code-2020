export default class Passport {

    constructor(private readonly fields: Map<string, string>) {}

    hasAllFields():boolean{
        return ( 
            this.fields.has("byr") && 
            this.fields.has("iyr") && 
            this.fields.has("eyr") && 
            this.fields.has("hgt") && 
            this.fields.has("hcl") && 
            this.fields.has("ecl") && 
            this.fields.has("pid") 
        ); 
    }

    isBirthDayValid(): boolean{
        if(!this.fields.has("byr")) return false;
        const birthYear = Number.parseInt(this.fields.get("byr"));
        return birthYear >= 1920 && birthYear <= 2002;        
    }

    isIssueYearValid(): boolean{
        if(!this.fields.has("iyr")) return false;
        const issueYear = Number.parseInt(this.fields.get("iyr"));
        return issueYear >= 2010 && issueYear <= 2020;        
    }

    isExpirationYearValid(): boolean{
        if(!this.fields.has("eyr")) return false;
        const expirationYear = Number.parseInt(this.fields.get("eyr"));
        return expirationYear >= 2020 && expirationYear <= 2030;        
    }

    isHeightValid(): boolean {
        if(!this.fields.has("hgt")) return false;
        const completeHeight = this.fields.get("hgt");
        const unit = completeHeight.slice(completeHeight.length - 2, completeHeight.length);
        const value = Number.parseInt(completeHeight.slice(0, completeHeight.length - 2));
        if(unit === "in"){
            return value >= 59 && value <= 76;
        } else if(unit === "cm"){
            return value >= 150 && value <= 193;
        }
        return false;
    }

    isHairColorValid(): boolean {
        if(!this.fields.has("hcl")) return false;
        const hairColor = this.fields.get("hcl");
        return /#[0-9a-f]{6}/m.test(hairColor) && hairColor.length === 7;
    }

    isEyeColorValid(): boolean {
        if(!this.fields.has("ecl")) return false;
        const eyeColor = this.fields.get("ecl");
        return ["amb","blu","brn","gry","grn","hzl","oth"].includes(eyeColor);
    }

    isPassportIdValid() : boolean {
        if(!this.fields.has("pid")) return false;
        const passportId = this.fields.get("pid");
        return /[0-9]{9}/m.exec(passportId) && passportId.length === 9;
    }

    isPassportValid(): boolean {
        return (
            this.hasAllFields() && 
            this.isBirthDayValid() && 
            this.isIssueYearValid() && 
            this.isExpirationYearValid() && 
            this.isHeightValid() && 
            this.isHairColorValid() && 
            this.isEyeColorValid() && 
            this.isPassportIdValid()
        );
    }


}