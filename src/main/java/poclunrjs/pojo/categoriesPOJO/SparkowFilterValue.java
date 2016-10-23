package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowFilterValue {

    @JsonProperty("Label")
    private String label;

    public String getLabel() {
        return label;
    }
}
