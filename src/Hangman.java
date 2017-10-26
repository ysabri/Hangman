package src;


import java.util.*;
import src.Network.*;
import java.io.*;

public class Hangman {

	//private static Listner[] requests = new Listner();
	private static Listners network = new Listners();

	private static void initPort(String port){
		int num = 0;
		try {
			num = Integer.parseInt(port);
		} catch(NumberFormatException e) {
			System.err.print("Please enter desired port as a number");
			System.exit(-1); 
		}
		if(num <= 0){
			System.err.print("Please enter a positve port number");
			System.exit(-1);
		}
		try{
			network.addPort(num);
		} catch(IOException e){
			System.err.print("Could not start listening on port " + port);
			System.exit(-1);
		}

	}
	private static void initNetwork(String ports) {
		int num = 0;

		try {
			num = Integer.parseInt(ports);
		} catch(NumberFormatException e) {
			System.err.print("Please enter desired number of ports");
			System.exit(-1); 
		}
		if(num <= 0){
			System.err.print("Please enter a positve number of ports");
			System.exit(-1);
		}
		network.addListners(num);
	}

	public static void main(String[] args){
		System.out.println("running..");

		if(args.length == 0){
			System.err.println("Please enter port or number of ports");
			System.exit(-1);
		}

		if(args.length>1) {
			initPort(args[1]);
		} else {
			initNetwork(args[0]);
		}

		System.out.print("Listing on: ");
		for(int curr : network.getListnersPorts())
			System.out.print(curr + ", ");
		System.out.println();
		




	}
}