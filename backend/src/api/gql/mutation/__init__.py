from .mutation_type import mutation

from .create_pathway import mutation
from .create_patient_pathway_instance import mutation
from .create_patient import mutation
from .create_user import mutation
from .create_decision_point import mutation
from .add_user_to_group import mutation
from .create_test_result import mutation
from .login import mutation


type_list=[mutation]