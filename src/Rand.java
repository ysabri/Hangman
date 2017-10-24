import java.util.*;

public class Rand {
        private static final long seed = 638*638;
        private static Random randObj = null;
        public static final int range = 370099;
        
        public Rand() {
            randObj = new Random(seed);
        }
        /*
        * Return random value between 0 (exclusive) and range (inclusive)
        */
        public int getNextInt() {
            return randObj.nextInt(range) + 1;
        }
        
}
