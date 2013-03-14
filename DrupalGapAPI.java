package com.easystreet3.drupalgap.android;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import android.util.Log;
import android.widget.Toast;

/**
 * The DrupalGapAPI class.
 */
public class DrupalGapAPI {
	private DrupalGap drupalgap;
	public DrupalGapAPI(DrupalGap drupalgap) {
		this.drupalgap = drupalgap;
		//Toast toast = Toast.makeText(drupalgap.getContext(), "Howdy hey!", );
		//toast.show();
		// Make a call to the System Connect resource.
		HttpURLConnection connection;
	    OutputStreamWriter request = null;
	    URL url = null;   
        String response = null;
        try
        {
        	// Set the URL.
            url = new URL("http://www.drupalgap.org/drupalgap/system/connect.json");
            
            // Init the connection.
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.setRequestMethod("POST");

            // Request the connection.
            request = new OutputStreamWriter(connection.getOutputStream());
            request.write("");
            request.flush();
            request.close();
            
            // Read the stream.
            String line = "";
            InputStreamReader isr = new InputStreamReader(connection.getInputStream());
            BufferedReader reader = new BufferedReader(isr);
            StringBuilder sb = new StringBuilder();
            while ((line = reader.readLine()) != null)
            {
                sb.append(line + "\n");
            }
            // Response from server after login process will be stored in response variable.                
            response = sb.toString();
            // You can perform UI operations here
            Toast.makeText(drupalgap.getContext(),"Message from Server: \n"+ response, Toast.LENGTH_SHORT).show();
            isr.close();
            reader.close();

        }
        catch(IOException e)
        {
            Toast.makeText(drupalgap.getContext(),e.toString(), Toast.LENGTH_SHORT).show();
            Log.v("drupalgap", e.toString());
        }
	}
}
