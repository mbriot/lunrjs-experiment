package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowChildren {

    @JsonProperty("Id")
    private String id;

    @JsonProperty("Children")
    private List<SparkowChildren> sparkowChildrens = new ArrayList<SparkowChildren>();

    public List<SparkowChildren> getSparkowChildrens() {
        return sparkowChildrens;
    }

    public String getId() {
        return id;
    }

}
