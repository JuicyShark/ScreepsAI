// Global settings file containing player information
import { getUsername } from './utils/helperFunctions';

//Your username - you shouldn't need to change this.
export const MY_USERNAME: string = getUsername();

// Enable this to build from source including screeps-profiler. 
export const USE_PROFILER: boolean = true;

//Enable this to wrap evaluations of constructor, init, and run phase for each colony in try...catch statemenets.
export const USE_TRY_CATCH: boolean = true;
