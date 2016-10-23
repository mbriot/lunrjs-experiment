package poclunrjs.pojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Filter implements Serializable {

    private String filterName;
    private List<String> values = new ArrayList<>();

    public String getFilterName() {
        return filterName;
    }

    public void setFilterName(String filterName) {
        this.filterName = filterName;
    }

    public List<String> getValues() {
        return values;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }

    public void addValue(String value) {
        this.values.add(value);
    }

    public Filter(String attributeName) {
        this.filterName = attributeName;
    }

    public Filter() {
    }

    @Override
    public boolean equals(Object object) {
        boolean sameSame = false;
        if (object != null && object instanceof Filter) {
            sameSame = this.filterName == ((Filter) object).filterName;
        }
        return sameSame;
    }
}
