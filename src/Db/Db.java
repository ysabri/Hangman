package src.Db;

import java.util.*;
import java.io.*;
//import Rand;

public class Db {

	private static Process db;
	private static OutputStream stdin;
	private static InputStream stdout;
	private static boolean seed = false;
	private static final Rand rand = new Rand(seed);
	private static String dbName = "Words";
	private static final String q = "SELECT word FROM " + dbName + " WHERE id = ";

	private static final boolean debugQuery = false;

	public Db(){

	}

	private void init() { 

		String[] cmd = {"sqlite3", "words"};
		ProcessBuilder dBuilder = new ProcessBuilder(cmd);
		try{
			db = dBuilder.start();
		} catch (IOException e){
			System.out.println("Constructor DB failed to start process "
				+ cmd[0]);
		}

		stdin = db.getOutputStream();
		stdout = db.getInputStream();
	}

	public String query() {

		init();
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stdin));
		int id = rand.getNextInt();

		if(debugQuery)
			System.out.println("id is: " + id);

		try{
			writer.write(q + id + ";");
			writer.flush();
			writer.close();
		} catch(IOException e){
			System.out.println("in Db.query an exception happened with writer: " + e);
		}

		Scanner in = new Scanner(stdout);
		String line = null;
		while (in.hasNextLine()){
			line = in.nextLine();
			if(debugQuery)
				System.out.println(line);
		}
		return line;

	}
}