package poclunrjs;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.GetMethod;

import java.io.*;
import java.util.zip.GZIPInputStream;

public class SparkowRequester {

    private String sparkowHost;

    private static MultiThreadedHttpConnectionManager connectionManager =
            new MultiThreadedHttpConnectionManager();
    private static HttpClient client = new HttpClient(connectionManager);

    public String requestSparkow(String path) throws IOException {
        GetMethod method = new GetMethod("http://" + sparkowHost + ".net/json/" + path);
        method.setRequestHeader(new Header("Accept-Encoding", "gzip"));
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
}
