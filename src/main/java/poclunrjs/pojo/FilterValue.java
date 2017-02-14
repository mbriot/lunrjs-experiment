package poclunrjs.pojo;

import java.io.Serializable;

public class FilterValue implements Serializable {

    private String value;
    private String url;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
    
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public FilterValue(String value, String url) {
        this.value = value;
        this.url = url;
    }

    public FilterValue() {
    
    }
}
