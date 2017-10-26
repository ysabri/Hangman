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
		System.out.println("socket local addr: " + this.client.getLocalSocketAddress());
		/*try{
			URL url = new URL("http://" + this.client.getLocalSocketAddress());
			
			HttpURLConnection mainCon = (HttpURLConnection) url.openConnection();
			mainCon.setRequestMethod("GET");
		} catch(MalformedURLException e) {
			System.out.println(" MalformedURLException happened in ClientListner: " + e);
		} catch(IOException i) {
			System.out.println("IOException happened in ClientListner");
		} /*catch(ProtocolException p) {
			System.out.println("ProtocolException happened in ClientListner");
		}*/

		try (
            DataOutputStream clientRes  = new DataOutputStream(client.getOutputStream());
            BufferedReader clientReq = new BufferedReader(
                new InputStreamReader(
                    client.getInputStream()));
        ) {
        	//System.out.println("socket is listening on: " 
			//	+ this.client.getLocalAddress() + 
			//	"\n " + this.client.getLocalPort());
            String inputLine, outputLine;
            //KnockKnockProtocol kkp = new KnockKnockProtocol();
            //outputLine = kkp.processInput(null);
            //respone.println(outputLine);

            while ((inputLine = clientReq.readLine()) != null) {
            	System.out.println("Recieved req:" + inputLine);
                //outputLine = kkp.processInput(inputLine);
                //System.out.println("****" + outputLine);
                clientRes.writeBytes("console.log(yo)");
                //if (outputLine.equals("Bye"))
                //    break;
            }
            client.close();
            return;
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
}