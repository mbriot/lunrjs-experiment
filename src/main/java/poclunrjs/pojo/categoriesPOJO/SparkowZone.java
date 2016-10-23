package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowZone {

    @JsonProperty("Name")
    private String name;

    @JsonProperty("Controls")
    private List<SparkowControl> sparkowControls = new ArrayList<SparkowControl>();

    public String getName() {
        return name;
    }

    public List<SparkowControl> getSparkowControls() {
        return sparkowControls;
    }
}
