package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowAttributeDefinition {

    @JsonProperty("Code")
    private String code;

    @JsonProperty("Label")
    private String label;

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }
}
