package poclunrjs;

import java.io.IOException;
import java.nio.charset.Charset;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class SparkowRequester {

    private String sparkowHost;
    
    CloseableHttpClient httpclient = HttpClients.createDefault();
    RequestConfig config;
    
    
    //ENABLED IN OFFICE ONLY
    {
    	CredentialsProvider credsProvider = new BasicCredentialsProvider();
        credsProvider.setCredentials(
                new AuthScope("gateway.zscaler.net", 80),
                new UsernamePasswordCredentials("GIHQ4ALL", "GIHQ4ALL"));
    	httpclient = HttpClients.custom().setDefaultCredentialsProvider(credsProvider).build();
    	HttpHost proxy = new HttpHost("gateway.zscaler.net", 80, "http");
        config = RequestConfig.custom().setProxy(proxy).build();
    }

    public String requestSparkow(String path)   throws IOException  {
    	String result = "";
    	HttpGet httpGet = new HttpGet("http://" + sparkowHost + ".net/json/" + path);
    	httpGet.setConfig(config);
        httpGet.addHeader("Accept-Encoding", "gzip");
        CloseableHttpResponse response = httpclient.execute(httpGet);
        HttpEntity entity = response.getEntity();
        result = EntityUtils.toString(entity, Charset.forName("UTF-8").name());  
        return result;
    }

    public SparkowRequester(String sparkowHost) {
        this.sparkowHost = sparkowHost;
    }
}
