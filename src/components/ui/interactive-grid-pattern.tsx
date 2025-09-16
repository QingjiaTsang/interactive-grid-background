'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';

/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
}

type SquareState = {
  state: 'highlighted' | 'fading';
  timeoutId?: NodeJS.Timeout;
};

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 50,
  height = 50,
  squares = [28, 28],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [squaresState, setSquaresState] = useState<Record<number, SquareState>>({});

  const getNeighbors = (x: number, y: number) => {
    const col = Math.floor(x / width);
    const row = Math.floor(y / height);
    const neighbors = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < vertical && newCol >= 0 && newCol < horizontal) {
          neighbors.push(newRow * horizontal + newCol);
        }
      }
    }
    return neighbors;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const neighbors = getNeighbors(x, y);
    const randomNeighbors = neighbors
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 0);

    setSquaresState((prevState) => {
      const newStates = { ...prevState };
      const squaresToUpdate: Record<number, SquareState> = {};

      for (const index of randomNeighbors) {
        const square = newStates[index];
        if (square?.timeoutId) {
          clearTimeout(square.timeoutId);
        }

        const timeoutId = setTimeout(() => {
          setSquaresState((current) => {
            const updated = { ...current };
            if (updated[index]) {
              updated[index] = { state: 'fading' };
            }
            return updated;
          });
        }, 400);

        squaresToUpdate[index] = { state: 'highlighted', timeoutId };
      }

      return { ...newStates, ...squaresToUpdate };
    });
  };

  const handleMouseLeave = () => {
    setSquaresState((prevState) => {
      const newStates = { ...prevState };
      for (const keyStr of Object.keys(newStates)) {
        const key = Number(keyStr);
        const square = newStates[key];
        if (square.timeoutId) {
          clearTimeout(square.timeoutId);
        }
        if (square.state === 'highlighted') {
          newStates[key] = { state: 'fading' };
        }
      }
      return newStates;
    });
  };

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn('absolute inset-0 h-full w-full', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        const squareState = squaresState[index];

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn('fill-transparent transition-colors duration-1000', squaresClassName)}
            style={{
              stroke:
                squareState?.state === 'highlighted'
                  ? '#DEEA51'
                  : squareState?.state === 'fading'
                  ? 'rgb(156 163 175 / 0.3)'
                  : 'rgb(156 163 175 / 0.3)',
            }}
          />
        );
      })}
    </svg>
  );
}
