package src;


import java.util.*;
import src.Network.*;

public class Hangman {

	//private static Listner[] requests = new Listner();
	private static Listners network = new Listners();

	private static void initNetwork(String ports) {
		int num = 0;

		try {
			num = Integer.parseInt(ports);
		} catch(NumberFormatException e) {
			System.err.print("Please enter desired number of ports");
			System.exit(1); 
		}
		if(num <= 0){
			System.err.print("Please enter a positve number of ports");
			System.exit(1);
		}
		network.addListners(num);
	}

	public static void main(String[] args){


		System.out.println("running..");
		initNetwork(args[0]);

		System.out.print("Listing on: ");
		for(int curr : network.getListnersPorts())
			System.out.print(curr + ", ");
		System.out.println();
		




	}
}