package src.Network;

import java.util.*;
import java.io.*;

public class Listners {

	private static LinkedList<Integer> portNums = new LinkedList<Integer>();
	private static LinkedList<Listner> listners = new LinkedList<Listner>();
	public Listners() {
		
	}

	public void addListners(int numListners){

		for(int i=0; i<numListners; i++){
			try{
				Listner temp = new Listner();
				portNums.add(temp.getPort());
				listners.add(temp);
			} catch (IOException e) {
				continue;
			}
		}

		for(Listner curr : listners)
			curr.start();


	}
	

	public LinkedList<Integer> getListnersPorts(){
		return this.portNums;
	}
}