package src.Network;

import java.util.*;
import java.net.*;
import java.io.*;

class Listner extends Thread {

	private ServerSocket serverSocket;

	public Listner() throws IOException {
		init();
	
	}

	private void init() throws IOException {
		serverSocket = new ServerSocket(0);
	} 

	public int getPort() {
		return this.serverSocket.getLocalPort();
	}

	public void run() {
		try {
			while(true) {
				new ClientListner(serverSocket.accept()).start();
			} 
		} catch (IOException e) {
			System.err.println("could not establish connection with client " +
				"at port: "+ this.serverSocket.getLocalPort() +" also: " + e);
			System.exit(-1);
		}
	}
}