import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';

// https://adventofcode.com/2020/day/7

class BagRule {
  private constructor(public readonly bagDescription : string) {};
  
  public readonly bagsInside: ({bagRule: BagRule, quantity: number}[]) = [];
  public static bagDictionary = new Map<string, BagRule>();

  public static createOrGetBag(bagDescription: string) : BagRule {
    if(this.bagDictionary.has(bagDescription)){
      return this.bagDictionary.get(bagDescription);
    }
    const bagRule = new BagRule(bagDescription);
    this.bagDictionary.set(bagDescription, bagRule);
    return bagRule;    
  }

  public addBagInside(bagDescription: string, quantity: number) : void {
    const bagRule = BagRule.createOrGetBag(bagDescription);
    this.bagsInside.push({bagRule, quantity});
  }
}

@Injectable()
export class Day07Service {
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService.readFileAsString('./input/day07.txt').split("\n");
    this.populateBagRules(fileContent);
    return `Part 01 [${this.countHowManyCanContain("shinygold")}] Part 02 [${this.howManyInside(BagRule.createOrGetBag("shinygold"))}]`;
  }

  populateBagRules(input: string[]) : void {
    BagRule.bagDictionary = new Map();
    input.map(line => line.replace(".", "").replace(",", "")).forEach(line => {
      const words = line.split(" ");
      const currentRule = BagRule.createOrGetBag(words[0] + words[1]);
      for(let i = 4; i < words.length; i += 4){
        const bagQuantity = Number.parseInt(words[i]);
        if(bagQuantity > 0){
          currentRule.addBagInside(words[i+1]+words[i+2], bagQuantity);
        }
      }
    });
  }

  canBagContain(bagDescription: string, bag: BagRule, bagsAlreadyCounted: Map<BagRule, boolean>) : boolean {
    if(bagsAlreadyCounted.has(bag)){
      return bagsAlreadyCounted.get(bag);
    }
    let canContain = false;
    if(bagsAlreadyCounted.get(bag)){
      canContain = true;
    } else if(bag.bagsInside.some(insideBag => insideBag.bagRule.bagDescription === bagDescription)){
      canContain = true;
    } else {
      canContain = bag.bagsInside.some(insideBag => this.canBagContain(bagDescription, insideBag.bagRule, bagsAlreadyCounted));
    }
    bagsAlreadyCounted.set(bag, canContain);
    return canContain;
  };

  countHowManyCanContain(bagDescription: string): number {
    const bagsAlreadyCounted = new Map<BagRule, boolean>();
    let result = 0;
    BagRule.bagDictionary.forEach(bag => {
      if(this.canBagContain(bagDescription, bag, bagsAlreadyCounted)) {
        result++;
      }
    });
    return result;
  }

  howManyInside(bag: BagRule) : number {
    // We could be saving intermediate results as we did in the part 01 but it is not necessary for solving this 
    return bag.bagsInside.map(insideBag => insideBag.quantity * (1 + this.howManyInside(insideBag.bagRule))).reduce((a,b) => a+b,0); 
  }

}
