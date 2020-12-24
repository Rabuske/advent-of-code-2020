import { Injectable } from '@nestjs/common';
import { FileReaderService } from 'src/utils/fileReader.service';
import { generateAllMatrixPermutations } from 'src/utils/matrixOperations';

// https://adventofcode.com/2020/day/20

const pattern = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   ",
].map(row => row.split(""));

class Image {
  constructor(public tiles: string[][]) {};

  public replacePattern(pattern: string[][]) {
    for (let rowIndex = 0; rowIndex < this.tiles.length - pattern.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.tiles[rowIndex].length - pattern[0].length; columnIndex++) {
        if(this.isAPerfectMatchForPattern(pattern, rowIndex, columnIndex)){
          this.applyReplacement(pattern, rowIndex, columnIndex);
        }
      }
    }
  }

  private isAPerfectMatchForPattern(pattern: string[][], rowIndex: number, columnIndex: number): boolean {
    for (let patternRowIndex = 0; patternRowIndex < pattern.length; patternRowIndex++) {
      for (let patternColumnIndex = 0; patternColumnIndex < pattern[0].length; patternColumnIndex++) {
        if(pattern[patternRowIndex][patternColumnIndex] === "#" && this.tiles[rowIndex+patternRowIndex][columnIndex+patternColumnIndex] !== '#') {
          return false;
        }        
      }
    }
    return true;
  }

  private applyReplacement(pattern: string[][], rowIndex: number, columnIndex: number) {
    for (let patternRowIndex = 0; patternRowIndex < pattern.length; patternRowIndex++) {
      for (let patternColumnIndex = 0; patternColumnIndex < pattern[0].length; patternColumnIndex++) {
        if(pattern[patternRowIndex][patternColumnIndex] === "#" && this.tiles[rowIndex+patternRowIndex][columnIndex+patternColumnIndex] === '#') {
          this.tiles[rowIndex+patternRowIndex][columnIndex+patternColumnIndex] = 'O';
        }        
      }
    }
  }

  public getImagePermutations(): Image[] {
    return generateAllMatrixPermutations(this.tiles).map(matrix => new Image(matrix));
  }

  public count(char: string) : number {
    return this.tiles.reduce((a, row) => row.filter(c => c === char).length + a, 0);
  }

}

class Puzzle {
  public arrangedPieces: PuzzlePiece[][];
  constructor(private pieces: PuzzlePiece[]) {
    const matrixSize = Math.sqrt(pieces.length);
    this.arrangedPieces = Array(matrixSize).fill(undefined).map(() => Array(matrixSize).fill(undefined));
  };

  private getUnmatchedBorders(piece: PuzzlePiece) : [string, string][] {
    const borders = piece.getAllPossibleBorders();
    
    const unMatched = borders.filter(border => 
      !this.pieces.filter(p => p.id !== piece.id).some(p => p.hasBorder(border))
    );
    return unMatched;
  }

  public arrange(){
    // Find corners
    const cornerPieces = this.pieces.filter(
      piece => this.getUnmatchedBorders(piece).length === 2
    );
      
    // Pick first corner and rotate it accordingly
    const unMatchedCornerBorders = this.getUnmatchedBorders(cornerPieces[0]);
    this.arrangedPieces[0][0] = cornerPieces[0].rotateAndFlipUntilMatch(unMatchedCornerBorders[0], unMatchedCornerBorders[1]);      
    
    this.pieces = this.pieces.filter(piece => piece.id !== this.arrangedPieces[0][0].id);

    // Fill the remaining pieces
    for (let rowIndex = 0; rowIndex < this.arrangedPieces.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.arrangedPieces[rowIndex].length; columnIndex++) {
        if(rowIndex === 0 && columnIndex === 0) {
          continue;
        }        

        // Get the upper piece as guideline
        if(columnIndex === 0) {
          const upperPiece = this.arrangedPieces[rowIndex-1][0];
          const borders = upperPiece.getAllBorders();
          const bottomBorder = borders.bottom.join("");

          const matchingPieces = this.pieces.filter(piece => piece.hasBorder(bottomBorder)); 
          this.arrangedPieces[rowIndex][columnIndex] = matchingPieces[0].rotateAndFlipUntilMatch([bottomBorder, bottomBorder], null);                   
        } else { // Left piece as guideline
          const leftPiece = this.arrangedPieces[rowIndex][columnIndex-1];
          const borders = leftPiece.getAllBorders();
          const rightBorder = borders.right.join("");

          const matchingPieces = this.pieces.filter(piece => piece.hasBorder(rightBorder)); 
          this.arrangedPieces[rowIndex][columnIndex] = matchingPieces[0].rotateAndFlipUntilMatch(null, [rightBorder, rightBorder]);                   
        }

        // Get the left piece as guideline  
        this.pieces = this.pieces.filter(piece => piece.id !== this.arrangedPieces[rowIndex][columnIndex].id);
      }
    }

    this.pieces = this.arrangedPieces.reduce((result, current) => {
        current.forEach(piece => result.push(piece)); 
        return result
    }, []);
  }

  public toImage(): Image {
    const piecesWithNoBorders = this.arrangedPieces.map(row => row.map(piece => piece.printWithNoBorders()));
    const numberOfPieces = piecesWithNoBorders.length;
    const tilesPerPiece = piecesWithNoBorders[0][0].length; 
    const length = numberOfPieces * tilesPerPiece;
    const matrix = Array(length).fill("").map(() => Array(length).fill(""));
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < matrix.length; columnIndex++) {
        const puzzleRowIndex = Math.floor(rowIndex / tilesPerPiece);
        const puzzleColumnIndex = Math.floor(columnIndex / tilesPerPiece);
        const pieceTileRowIndex = rowIndex % tilesPerPiece;
        const pieceTileColumnIndex = columnIndex % tilesPerPiece;
        matrix[rowIndex][columnIndex] = piecesWithNoBorders[puzzleRowIndex][puzzleColumnIndex][pieceTileRowIndex][pieceTileColumnIndex];
      }
    }
    return new Image(matrix);
  }
}

class PuzzlePiece {
  constructor(private tiles:string[][], private _id: number) {}

  getAllPossibleBorders() : [string, string][] {
    const borders = this.getAllBorders();
    return Object.values(borders).map(border => [border.join(""), [...border].reverse().join("")]);
  }

  getAllBorders(): {top: string[], bottom: string[], left: string[], right:string[]} {
    return {
      top: [... this.tiles[0]],
      bottom: [... this.tiles[this.tiles.length - 1]],   
      left: [...this.tiles.map(row => row[0])],
      right: [...this.tiles.map(row => row[row.length - 1])]
    };
  }

  hasBorder(border: string|[string, string]): boolean {
    const borders = this.getAllPossibleBorders();
    if(typeof border === 'string') {
      const result = borders.some(b => b.includes(border));
      return result;
    } else {
      return borders.some(b => b.includes(border[0]) || b.includes(border[1]));
    }    
  }

  getAllPermutations() : PuzzlePiece[] {
    const permutations = generateAllMatrixPermutations(this.tiles);
    return permutations.map(matrix => new PuzzlePiece(matrix, this._id));
  } 

  rotateAndFlipUntilMatch(top?: [string, string], left?: [string, string]) : PuzzlePiece {
    // Get all permutations of the piece (I'm lazy and three days behind the schedule 😕)
    const pieces = this.getAllPermutations();

    // Now find the first permutation where the top and left border match
    for (let index = 0; index < pieces.length; index++) {
      const borders = pieces[index].getAllBorders();
      const topBorder = borders.top.join("");
      const leftBorder = borders.left.join("");
      
      if(top && left) {
        if((topBorder === top[0] || topBorder === top[1]) && (leftBorder === left[0] || leftBorder === left[1])){
          return pieces[index];
        }                
      }

      if(top && !left && (topBorder === top[0] || topBorder === top[1])) {
        return pieces[index];
      }

      if(left && !top && (leftBorder === left[0] || leftBorder === left[1])) {
        return pieces[index];
      }
    }
  }

  public printWithNoBorders() : string[][] {
    return this.tiles.slice(1, this.tiles.length - 1).map(row => row.slice(1, row.length-1));
  }

  public get id() : number {
    return this._id;
  }
}


@Injectable()
export class Day20Service implements Processor{
  constructor(private readonly fileReaderService: FileReaderService) {}

  processInput(): string {
    const fileContent = this.fileReaderService
      .readFileAsString('./input/day20.txt')
      .split('\n');

    const puzzle = this.createPuzzle(fileContent);
    puzzle.arrange();
    const image = puzzle.toImage();
    return `Part 01 [${this.getMultiplicationOf4Corners(puzzle)}] Part 02 [${this.numberOfWavesAfterSeaMonsters(image)}]`;
  }  

  createPuzzle(fileContent: string[]) : Puzzle {
    const puzzlePieces = new Array<PuzzlePiece>();
    let matrix = new Array<Array<string>>();
    let id = 0;
    fileContent.forEach(line => {
      if(line.length <= 1 && id !== 0) {
        puzzlePieces.push(new PuzzlePiece(matrix, id));
        matrix = new Array<Array<string>>();
        id = 0;
        return;
      }

      const idCandidate = line.match(/[0-9]+/)
      if(idCandidate) {
        id = Number.parseInt(idCandidate[0]);
        return;
      }

      matrix.push(line.split(""));
    });

    if(id !== 0) {
      puzzlePieces.push(new PuzzlePiece(matrix, id));
    }

    return new Puzzle(puzzlePieces);
  }

  getMultiplicationOf4Corners(puzzle : Puzzle): number {
    const length = puzzle.arrangedPieces.length;
    return puzzle.arrangedPieces[0][0].id * 
           puzzle.arrangedPieces[0][length - 1].id *
           puzzle.arrangedPieces[length - 1][0].id * 
           puzzle.arrangedPieces[length - 1][length - 1].id; 
  }

  numberOfWavesAfterSeaMonsters(image:Image) {
    const imagePermutations = image.getImagePermutations();
    
    for (let index = 0; index < imagePermutations.length; index++) {
      const permutation = imagePermutations[index];
      permutation.replacePattern(pattern);
      if(permutation.count('O') > 0) {
        return permutation.count('#');
      };      
    }
  }

}
