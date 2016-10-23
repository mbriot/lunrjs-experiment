package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowProduct {

    @JsonProperty("Attributes")
    private List<SparkowAttribute> sparkowAttributes = new ArrayList<SparkowAttribute>();

    public List<SparkowAttribute> getSparkowAttributes() {
        return sparkowAttributes;
    }

    @Override
    public String toString() {
        return sparkowAttributes.toString();
    }
}
