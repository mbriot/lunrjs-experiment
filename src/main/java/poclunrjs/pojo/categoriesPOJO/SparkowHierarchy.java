package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowHierarchy {

    @JsonProperty("Children")
    private List<SparkowChildren> sparkowChildrens = new ArrayList<SparkowChildren>();

    public List<SparkowChildren> getSparkowChildrens() {
        return sparkowChildrens;
    }
}
