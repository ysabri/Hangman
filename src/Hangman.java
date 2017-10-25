package src;


import java.util.*;
import src.Db.*;

public class Hangman {

	private static Db database;

	public static void main(String[] args){
		database = new Db();
		System.out.println("running..");

		Scanner in = new Scanner(System.in);
		String word = null;
		while(in.hasNextLine()){
			String next = in.nextLine();
			if(next.equals("bye")){
				break;
			} else {
				word = database.query();
				//System.out.println(word);
			}
		}
	}
}