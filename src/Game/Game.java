package src.Game;

import java.util.*;
import src.Db.*;

class Game {
	private static String word;

	public Game() {
		init();
	}

	private void init(){
		Db db = new Db();
		word = db.query();

	}

	public void restart() {
		init();
	}
}