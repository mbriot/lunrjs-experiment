package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowHeader {

    @JsonProperty("Controls")
    private List<SparkowControl> sparkowControls = new ArrayList<>();

    public List<SparkowControl> getSparkowControls() {
        return sparkowControls;
    }
}
