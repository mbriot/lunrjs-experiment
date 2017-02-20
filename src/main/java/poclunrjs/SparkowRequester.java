package poclunrjs;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.GetMethod;

import java.io.*;
import java.util.zip.GZIPInputStream;
import org.apache.commons.httpclient.Credentials;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HostConfiguration;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthScope;

public class SparkowRequester {

    private String sparkowHost;
    private boolean isProxyUsed;
    private String proxyHost;
    private int proxyPort;
    private String proxyUsername;
    private String proxyPassword;

    private static MultiThreadedHttpConnectionManager connectionManager =
            new MultiThreadedHttpConnectionManager();
    private static HttpClient client = new HttpClient(connectionManager);

    public String requestSparkow(String path) throws IOException {
        GetMethod method = new GetMethod("http://" + sparkowHost + ".net/json/" + path);
        method.setRequestHeader(new Header("Accept-Encoding", "gzip"));
        if (isProxyUsed) {
            HostConfiguration config = client.getHostConfiguration();
            config.setProxy(proxyHost, proxyPort);
            Credentials credentials = new UsernamePasswordCredentials(proxyUsername, proxyPassword);
            AuthScope authScope = new AuthScope(proxyHost, proxyPort);
            client.getState().setProxyCredentials(authScope, credentials);	
        }
		
        byte[] responseBody;
        String response = null;
        client.executeMethod(method);
        responseBody = method.getResponseBody();

        GZIPInputStream ungzippedResponse = new GZIPInputStream(new ByteArrayInputStream(responseBody));
        Reader reader = new InputStreamReader(ungzippedResponse, "UTF-8");
        Writer writer = new StringWriter();
        char[] buffer = new char[10240];
        for (int length = 0; (length = reader.read(buffer)) > 0; ) {
            writer.write(buffer, 0, length);
        }
        response = writer.toString();
        method.releaseConnection();
        return response;
    }

    public SparkowRequester(String sparkowHost) {
        this.sparkowHost = sparkowHost;
    }
	
	public boolean isProxyUsed() {
		return isProxyUsed;
	}
	
	public void setIsProxyUsed(boolean isProxyUsed) {
		this.isProxyUsed = isProxyUsed;
	}
	
	public String getProxyHost() {
		return proxyHost;
	}
	
	public void setProxyHost(String proxyHost) {
		this.proxyHost = proxyHost;
	}
	
	public int getProxyPort() {
		return proxyPort;
	}
	
	public void setProxyPort(int proxyPort) {
		this.proxyPort = proxyPort;
	}
	
	public String getProxyUsername() {
		return proxyUsername;
	}
	
	public void setProxyUsername(String proxyUsername) {
		this.proxyUsername = proxyUsername;
	}
	
	public String getProxyPassword() {
		return proxyPassword;
	}
	
	public void setProxyPassword(String proxyPassword) {
		this.proxyPassword = proxyPassword;
	}

}
