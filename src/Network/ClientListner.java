package src.Network;

import java.util.*;
import java.net.*;
import java.io.*;


class ClientListner extends Thread {
	private Socket client = null;

	public ClientListner (Socket socket) {
		this.client = socket;
	}

	public void run() {
		try (
            PrintWriter respone = new PrintWriter(client.getOutputStream(), true);
            BufferedReader in = new BufferedReader(
                new InputStreamReader(
                    client.getInputStream()));
        ) {
            String inputLine, outputLine;
            KnockKnockProtocol kkp = new KnockKnockProtocol();
            outputLine = kkp.processInput(null);
            respone.println(outputLine);

            while ((inputLine = in.readLine()) != null) {
            	System.out.println(inputLine);
                outputLine = kkp.processInput(inputLine);
                System.out.println("****" + outputLine);
                respone.println(outputLine);
                if (outputLine.equals("Bye"))
                    break;
            }
            client.close();
            return;
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
}