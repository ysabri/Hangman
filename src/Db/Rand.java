package src.Db;


import java.util.*;

public class Rand {
        private static final long seed = 638*638;
        private static Random randObj = null;
        //How many words in Db
        public static final int range = 370099;
        
        public Rand(boolean useSeed) {
            if(useSeed){
                randObj = new Random(seed);
            } else {
                randObj = new Random();
            }
        }
        /*
        * Return random value between 0 (exclusive) and range (inclusive)
        */
        public int getNextInt() {
            return randObj.nextInt(range) + 1;
        }
        
}
